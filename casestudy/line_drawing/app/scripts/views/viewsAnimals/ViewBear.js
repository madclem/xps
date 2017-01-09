// ViewBear.js

import ViewAnimal from './ViewAnimal'
import Bear from '../../animals/Bear'

class ViewBear extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Bear(pos);
		super.reset(pos, rx, ry);
	}
}

export default ViewBear;
