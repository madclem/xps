const Motions = {
	basic: (options)=>{
		options.targetPoint[0] = options.position[0] + Math.cos(options.time/20 + options.startAngle) * options.radius;
		options.targetPoint[2] = options.position[2] + Math.sin(options.time/20 + options.startAngle) * options.radius;
	},

	circle: (options)=>{
		options.targetPoint[0] = options.position[0] + Math.cos(options.time/20 + options.startAngle) * options.radius;
		options.targetPoint[2] = options.position[2] + Math.sin(options.time/20 + options.startAngle) * options.radius;

		options.xoff += .01 *  1;
		options.yoff += .01 *  1;

		var p = options.perlin.perlin2(options.xoff, options.yoff)
		options.targetPoint[1] += p/20;
		options.targetPoint[1] += Math.sin(Math.tan(Math.cos(options.time/80 +options.startAngle) * 1.2)) * .01;
	},


	snake: (options)=>{
		options.targetPoint[0] = options.position[0] + Math.cos(options.time/40 + options.startAngle) * options.radius;
		options.targetPoint[2] = options.position[2] + Math.sin(options.time/50 + options.startAngle) * options.radius * 1.2 ;

		options.targetPoint[1] = options.position[1] + Math.abs(Math.sin(options.time / 100) * 4) - 2;
		options.targetPoint[0] += Math.cos(Math.pow(8, Math.sin(options.time/40 + options.startAngle))) * .5;
		options.targetPoint[1] += Math.sin(Math.pow(8, Math.sin(options.time/20 + options.startAngle))) * 1;
	}
}

export default Motions
