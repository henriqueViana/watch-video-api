export const KafkaConfig = {
  clientId: 'video-streaming-client',
  brokers: ['kafka:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
}