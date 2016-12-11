
var DoubleSpring = function(){

	this.x				 = 0;
	this.ax				 = 0;
	this.dx				 = 0;
	this.tx				 = 0;

	this.y				 = 0;
	this.ay				 = 0;
	this.dy				 = 0;
	this.ty				 = 0;

//	public static var damp				:Number = 0.39;
//	public static var springiness		:Number = 0.6;

	this.max			 = 30;

	this.damp			 = 0.75;
	this.springiness	 = 0.09

	this.max = 160;
	this.damp = 0.8;
	this.springiness = 0.01;

//	this.max = 130
//	this.damp = 0.33
//	this.springiness = 0.5//369

};


DoubleSpring.constructor = DoubleSpring;
	// C O N S T R U C T O R S ---------------------------------------//

	// P U B L I C ---------------------------------------------------//

DoubleSpring.prototype.update = function()
{
	//var damp = this.damp;

	//	var springiness = this.springiness;
	//	var max = this.max;

	this.ax=(this.tx-this.x)*this.springiness;

	this.dx+=this.ax;
	this.dx*=this.damp;

	if(this.dx < -this.max)this.dx = -this.max;
	else if(this.dx > this.max)this.dx = this.max;

	//Math2.cap(dx, -max, max);

	this.x+=this.dx;

	this.ay=(this.ty-this.y)*this.springiness;

	this.dy+=this.ay;
	this.dy*=this.damp;

	if(this.dy < -this.max)this.dy = -this.max;
	else if(this.dy > this.max)this.dy = this.max;

	this.y+=this.dy;
}

DoubleSpring.prototype.reset = function()
{
	this.x = 0;
	this.ax = 0;
	this.dx = 0;
	this.tx = 0;

	this.y = 0;
	this.ay = 0;
	this.dy = 0;
	this.ty = 0;
}

module.exports = DoubleSpring;
