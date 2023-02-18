export class MicroserviceCommunicationInterface {
  state: 'success' | 'failure';
  message: string;
  data?: any;
}
