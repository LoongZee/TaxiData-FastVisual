package com.lzh.web;


import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;


import com.lzh.db.SpringUtil;
import com.lzh.db.StreamingStatementCreator;
import com.lzh.web.Model.Pos;
import com.lzh.web.Model.ComputePoi;

/**
 * Servlet implementation class PoiServlet
 */
@WebServlet(description = "poi servlet", urlPatterns = { "/poi" })
public class PoiServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
 
	private static double M_PI = Math.PI;
	//6378137???????????????,20037508.342789244
	private static double Degree2Meter = M_PI * 6378137 / 180.0;
    
	/**
     * @see HttpServlet#HttpServlet()
     */
    public PoiServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String bbox= request.getParameter("BBOX");
		String width= request.getParameter("WIDTH");
	    String height= request.getParameter("HEIGHT");
	    int z = Integer.parseInt(request.getParameter("z").toString());
	    String layer = request.getParameter("layer");
	    System.out.println(z+","+layer+","+bbox);
	    
	    int w = Integer.parseInt(width),h = Integer.parseInt(height);
	    String[] extent = bbox.split(",");
	    //115.476,39.443,117.498,40.982
	    double xmin = Double.parseDouble(extent[0]),
	    		ymin = Double.parseDouble(extent[1]),
	    		xmax = Double.parseDouble(extent[2]),
	    		ymax = Double.parseDouble(extent[3]);
	    double sc_x=w/(xmax-xmin),
	    		sc_y=h/(ymax-ymin);
		//????
	    double dis = 20000/(z+1);
	    System.out.println(dis/Degree2Meter);
	    
	    Pos.buf = dis/Degree2Meter;

		//????
        BufferedImage image = new BufferedImage(w, h,BufferedImage.TYPE_INT_RGB);
	    java.awt.Graphics2D g2d = image.createGraphics();
	    image = g2d.getDeviceConfiguration().createCompatibleImage(w,h,java.awt.Transparency.TRANSLUCENT);
	    g2d.dispose();
	    final java.awt.Graphics2D g2d_poi = image.createGraphics();
	    g2d_poi.setColor(Color.RED);
	    
	    List<String> sql_array = new ArrayList<String>();
		JdbcTemplate jdbcTemplate = (JdbcTemplate) SpringUtil.getBean("jdbcTemplate");
        long t1 = System.currentTimeMillis();
    	
        String quad_sql = "select * from quad_index where ((GREATEST(long_min,{0}) > LEAST(long_max,{1})) OR (GREATEST(lat_min,{2}) > LEAST(lat_max,{3}))) IS FALSE ORDER BY poinum DESC";
        quad_sql = MessageFormat.format(quad_sql, xmin, xmax, ymin, ymax);
        System.out.println(quad_sql);
        jdbcTemplate.query(quad_sql,  new RowCallbackHandler() {  
            public void processRow(ResultSet rs) throws SQLException {  
            	String sub_table = rs.getString("subtable");
            	String sql = "select t_long,t_lat from "+sub_table;
            	sql_array.add(sql);
                }
            }
        );
           
        ExecutorService executor = Executors.newCachedThreadPool();  
        List<ComputePoi> Compute = new ArrayList<ComputePoi>();
        int sqlsize = sql_array.size();
        for (int i = 0; i < sqlsize; i++ ){
        	Compute.add(new ComputePoi(jdbcTemplate, 
        			     new StreamingStatementCreator(sql_array.get(i))
        			     ));
        }
        System.out.println("Computesize:"+Compute.size());
        
        try {
			List<Future<List<Pos>>> coms = executor.invokeAll(Compute);
			
			for (Future<List<Pos>> i : coms) {  
					List<Pos> temp=i.get();
					int num = temp.size();
					for(int k = 0;k < num; k++){
                		double scrx = (temp.get(k).x-xmin)*sc_x,
                				scry = (ymax-temp.get(k).y)*sc_y;      	    	 
                		g2d_poi.fillOval((int)scrx,(int)scry,3,3); 
					}					
	        }  
		    executor.shutdown();  
		    long t2 = System.currentTimeMillis();  
		    System.out.println("Finished Query! "+(t2-t1)+"ms");
		
		    g2d_poi.dispose();
		    OutputStream os = response.getOutputStream();
	    	int count = 0;
	    	byte[] buffer = new byte[1024 * 1024];
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            InputStream inStream = new ByteArrayInputStream(baos.toByteArray());
	        while ((count = inStream.read(buffer)) != -1){
	            os.write(buffer, 0, count);
	        }
	        os.flush();	        
	        inStream.close();
	        os.close();
	    }
	    catch (Exception e) {
	        e.printStackTrace();
	    }
	    
	}
}

/*
List<Pos> list = jdbcTemplate.query(state, new Object[]{xmin,xmax,ymin,ymax},  new ResultSetExtractor<List<Pos>>(){

	public List<Pos> extractData(ResultSet rs) throws SQLException,DataAccessException 
	{
		List<Pos> fc = new ArrayList<Pos>();
		while(rs.next()){
        	Pos pos = new Pos(rs.getDouble("t_long"),rs.getDouble("t_lat"));
        	fc.add(pos);
        	
        	if (!fc.contains(pos)) {
        		fc.add(pos);
        		double scrx = (pos.x-xmin)*sc_x,
        				scry = (ymax-pos.y)*sc_y;      	    	 
        		g2d_poi.fillOval((int)scrx,(int)scry,3,3); 
        	} 
        	
        }
		
		return fc;
	}
});
*/

