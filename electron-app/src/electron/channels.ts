export namespace NeuronChannels{

  /**
   * NeuronList update notifications
   *
   * Backend to fronted. Triggers when NL changes
   *
   * args: Updated neuron list
   *
   **/
  export const updateNeuronList = "updNL";

  /**
   * Get neuron list channel
   *
   * Frontend to backend
   *
   * request args: None
   * response args: Neuron list id + name
   *
   **/
  export const getNeuronListRequest = "getNL";
  export const getNeuronListResponse = "getNLres";

  /**
   * Get neuron channel
   *
   * Frontend to backend
   *
   * request args: neuron id (num)
   * response args: Neuron object {id, origin and neuron}
   *
   **/
  export const getNeuronRequest = "getNeuron";
  export const getNeuronResponse = "getNeuronRes";

  /**
   * Delete neuron channel
   *
   * Frontend to backend
   *
   * request args: neuron id (num)
   * response args: Updated neuron list
   *
   **/
  export const removeNeuronRequest = "delNeuron";
  export const removeNeuronResponse = "delNeuronRes";



}
