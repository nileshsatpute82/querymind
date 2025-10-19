import * as couchbase from 'couchbase';

let cluster: couchbase.Cluster | null = null;
let bucket: couchbase.Bucket | null = null;
let collection: couchbase.Collection | null = null;

export interface CouchbaseConfig {
  connectionString: string;
  username: string;
  password: string;
  bucketName: string;
}

/**
 * Initialize Couchbase connection
 */
export async function initCouchbase(config: CouchbaseConfig): Promise<void> {
  if (cluster) {
    console.log('[Couchbase] Already connected');
    return;
  }

  try {
    console.log('[Couchbase] Connecting to cluster...');
    
    cluster = await couchbase.connect(config.connectionString, {
      username: config.username,
      password: config.password,
      timeouts: {
        connectTimeout: 10000,
        kvTimeout: 2500,
        queryTimeout: 75000,
      },
    });

    bucket = cluster.bucket(config.bucketName);
    collection = bucket.defaultCollection();

    // Test connection by attempting a simple operation
    try {
      await collection.get('_connection_test').catch(() => {});
    } catch (error) {
      // Ignore error, just testing connection
    }

    console.log('[Couchbase] Connected successfully');
    
    // Create indexes if they don't exist
    await createIndexes();
  } catch (error) {
    console.error('[Couchbase] Connection failed:', error);
    cluster = null;
    bucket = null;
    collection = null;
    throw error;
  }
}

/**
 * Create necessary indexes for queries
 */
async function createIndexes(): Promise<void> {
  if (!cluster) return;

  try {
    const queryIndexManager = cluster.queryIndexes();

    // Create primary index if it doesn't exist
    try {
      await queryIndexManager.createPrimaryIndex(process.env.COUCHBASE_BUCKET || 'interview-GPT', {
        ignoreIfExists: true,
      });
      console.log('[Couchbase] Primary index created/verified');
    } catch (error: any) {
      if (!error.message?.includes('already exists')) {
        console.warn('[Couchbase] Primary index creation warning:', error.message);
      }
    }

    // Create index for interview queries
    try {
      await queryIndexManager.createIndex(
        process.env.COUCHBASE_BUCKET || 'interview-GPT',
        'idx_type_createdBy',
        ['type', 'createdBy', 'createdAt'],
        { ignoreIfExists: true }
      );
      console.log('[Couchbase] Interview index created/verified');
    } catch (error: any) {
      if (!error.message?.includes('already exists')) {
        console.warn('[Couchbase] Interview index creation warning:', error.message);
      }
    }

    // Create index for session queries
    try {
      await queryIndexManager.createIndex(
        process.env.COUCHBASE_BUCKET || 'interview-GPT',
        'idx_type_interviewId',
        ['type', 'interviewId', 'createdAt'],
        { ignoreIfExists: true }
      );
      console.log('[Couchbase] Session index created/verified');
    } catch (error: any) {
      if (!error.message?.includes('already exists')) {
        console.warn('[Couchbase] Session index creation warning:', error.message);
      }
    }
  } catch (error) {
    console.error('[Couchbase] Index creation failed:', error);
  }
}

/**
 * Get Couchbase collection
 */
export function getCollection(): couchbase.Collection {
  if (!collection) {
    throw new Error('Couchbase not initialized. Please configure COUCHBASE_CONNECTION_STRING, COUCHBASE_USERNAME, COUCHBASE_PASSWORD, and COUCHBASE_BUCKET environment variables.');
  }
  return collection;
}

/**
 * Get Couchbase cluster for queries
 */
export function getCluster(): couchbase.Cluster {
  if (!cluster) {
    throw new Error('Couchbase not initialized. Please configure COUCHBASE_CONNECTION_STRING, COUCHBASE_USERNAME, COUCHBASE_PASSWORD, and COUCHBASE_BUCKET environment variables.');
  }
  return cluster;
}

/**
 * Check if Couchbase is connected
 */
export function isConnected(): boolean {
  return cluster !== null && bucket !== null && collection !== null;
}

/**
 * Close Couchbase connection
 */
export async function closeCouchbase(): Promise<void> {
  if (cluster) {
    await cluster.close();
    cluster = null;
    bucket = null;
    collection = null;
    console.log('[Couchbase] Connection closed');
  }
}

