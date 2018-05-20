export default class Step{
    constructor(operation, count){
        this.operation = operation;
        this.count = count;
    }

    isEqual(step){
        if(!step) return false;
        return this.operation === step.operation && this.count === step.count;
    }

    getString(swap){
        return this.operation.name + this.count;
    }
}