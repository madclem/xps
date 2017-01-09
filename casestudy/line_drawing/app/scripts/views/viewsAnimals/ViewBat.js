// ViewBat.js

import ViewAnimal from './ViewAnimal'
import Bat from '../../animals/Bat'


class ViewBat extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Bat(pos);
		super.reset(pos, rx, ry);
	}
	// _init(){
	//
	// }
}

export default ViewBat;
