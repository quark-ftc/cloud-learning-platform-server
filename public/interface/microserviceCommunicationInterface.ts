export class MicroserviceCommunicationInterface {
  status: 'success' | 'failure';
  message: string;
  data?: any;
}
