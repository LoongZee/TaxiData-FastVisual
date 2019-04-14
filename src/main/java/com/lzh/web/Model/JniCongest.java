package com.lzh.web.Model;

public class JniCongest {
	static {
        // 调用文件名为congest.dll的动态库
		try {
			//System.out.println(System.getProperty("java.library.path"));
			System.loadLibrary("congest");  
		  } catch (Throwable t) {
			  System.out.println(t);
		    throw t;
		  }
		}  
	/*
    public static void main(String[] args){  
    	JniCongest demo = new JniCongest();    
        System.out.println(demo.Citycongest(10));    
    }    */
    
    public native int Citycongest(int num);   

}
