// ViewBoar.js

import ViewAnimal from './ViewAnimal'
import Boar from '../../animals/Boar'

class ViewBoar extends ViewAnimal {

	constructor(pos) {
		super(pos);
	}

	reset(pos, rx, ry){
		this.shape = new Boar(pos);
		super.reset(pos, rx, ry);
	}
	// _init(){
	//
	// }
}

export default ViewBoar;
