// ViewDear.js

import ViewAnimal from './ViewAnimal'
import Weasel from '../../animals/Weasel'

class ViewDear extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Weasel(pos);
		super.reset(pos, rx, ry);
	}
}

export default ViewDear;
