const Motions = {

	move1(options){
    let time = options.time;
    let targetPoint = options.targetPoint;
    if(time > 120){
      time = 0;

      Easings.to(this.targetPoint, .6, {
        0: Math.random()
      })
    }
  },

  move2(options){
    let time = options.time;
    let targetPoint = options.targetPoint;

    targetPoint[0] = Math.cos(time/200) * .5 + .5;
  },

  move4(options){
    let time = options.time;
    let targetPoint = options.targetPoint;


    targetPoint[0] = Math.pow(Math.abs(Math.sin(time/200 * 2)) * .6, Math.sin(time/200 * 2)) * .5;
  },

  move3(options){
    let time = options.time;
    let targetPoint = options.targetPoint;


    targetPoint[0] = Math.abs(Math.cos(time/200 * 2) * Math.sin(time/200 * 4)) * 1;
  }
}

export default Motions
