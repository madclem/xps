import ViewPlane from '../views/ViewPlane';
import ViewPlaneDetailed from '../views/ViewPlaneDetailed';

class Floor {
  constructor(){
    this.viewPlane = new ViewPlane();
    this.viewPlaneDetailed = new ViewPlaneDetailed();
  }

  render(){
    this.viewPlaneDetailed.render();
    this.viewPlane.render();
  }

}

export default Floor;
