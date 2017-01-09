// ViewRabbit.js

import ViewAnimal from './ViewAnimal'
import Rabbit from '../../animals/Rabbit'

class ViewRabbit extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Rabbit(pos);
		super.reset(pos, rx, ry);
	}
}

export default ViewRabbit;
