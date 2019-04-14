package com.lzh.web.Model;


public class Pos {
	public double x;
	public double y;
	public int nearPoi;
	static public double buf;

	public Pos(double x, double y) {
		this.x = x;
		this.y = y;
		this.nearPoi = 0;
	}

	public boolean equals(Object pt) {
		if (pt instanceof Pos){
			if(Math.abs(this.x - ((Pos) pt).x) <= buf && Math.abs(this.y- ((Pos) pt).y) <= buf){
				((Pos) pt).nearPoi++;
				return true;
			}
			else{
				return false;
			} 
		}
		return false;
	}

	public int hashCode() {
		return Integer.valueOf(x + "" + y);
	}
	
}
