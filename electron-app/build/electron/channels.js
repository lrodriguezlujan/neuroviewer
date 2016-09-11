"use strict";
var NeuronChannels;
(function (NeuronChannels) {
    /**
     * NeuronList update notifications
     *
     * Backend to fronted. Triggers when NL changes
     *
     * args: Updated neuron list
     *
     **/
    NeuronChannels.updateNeuronList = "updNL";
    /**
     * Get neuron list channel
     *
     * Frontend to backend
     *
     * request args: None
     * response args: Neuron list id + name
     *
     **/
    NeuronChannels.getNeuronListRequest = "getNL";
    NeuronChannels.getNeuronListResponse = "getNLres";
    /**
     * Get neuron channel
     *
     * Frontend to backend
     *
     * request args: neuron id (num)
     * response args: Neuron object {id, origin and neuron}
     *
     **/
    NeuronChannels.getNeuronRequest = "getNeuron";
    NeuronChannels.getNeuronResponse = "getNeuronRes";
    /**
     * Delete neuron channel
     *
     * Frontend to backend
     *
     * request args: neuron id (num)
     * response args: Updated neuron list
     *
     **/
    NeuronChannels.removeNeuronRequest = "delNeuron";
    NeuronChannels.removeNeuronResponse = "delNeuronRes";
})(NeuronChannels = exports.NeuronChannels || (exports.NeuronChannels = {}));
//# sourceMappingURL=channels.js.map