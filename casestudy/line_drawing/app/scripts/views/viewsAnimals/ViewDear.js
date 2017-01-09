// ViewDear.js

import ViewAnimal from './ViewAnimal'
import Dear from '../../animals/Dear'

class ViewDear extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Dear(pos);
		super.reset(pos, rx, ry);
	}
}

export default ViewDear;
