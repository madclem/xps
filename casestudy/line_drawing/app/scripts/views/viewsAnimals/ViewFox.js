// ViewDear.js

import ViewAnimal from './ViewAnimal'
import Fox from '../../animals/Fox'

class ViewDear extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Fox(pos);
		super.reset(pos, rx, ry);
	}
}

export default ViewDear;
