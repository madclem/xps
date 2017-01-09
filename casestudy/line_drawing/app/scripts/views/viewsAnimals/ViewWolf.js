// ViewDear.js

import ViewAnimal from './ViewAnimal'
import Wolf from '../../animals/Wolf'

class ViewDear extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Wolf(pos);
		super.reset(pos, rx, ry);
	}
}

export default ViewDear;
