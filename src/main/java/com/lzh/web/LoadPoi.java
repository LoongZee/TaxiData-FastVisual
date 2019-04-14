package com.lzh.web;

import java.awt.Color;
import java.awt.Point;
import java.awt.RadialGradientPaint;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;

import com.lzh.db.SpringUtil;
import com.lzh.db.StreamingStatementCreator;
import com.lzh.web.Model.Pos;

/**
 * Servlet implementation class LoadPoi
 */
@WebServlet("/LoadPoi")
public class LoadPoi extends HttpServlet {
	private static final long serialVersionUID = 1L;
	 
	private static double M_PI = Math.PI;
	//6378137赤道半径，一度对应赤道上的一米,20037508.342789244
	private static double Degree2Meter = M_PI * 6378137 / 180.0;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoadPoi() {
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
	    String layer = request.getParameter("LAYERS");
	    System.out.println(z+","+layer+","+bbox);
	    
	    int w = Integer.parseInt(width),h = Integer.parseInt(height);
	    String[] extent = bbox.split(",");
	    double xmin = Double.parseDouble(extent[0]),
	    		ymin = Double.parseDouble(extent[1]),
	    		xmax = Double.parseDouble(extent[2]),
	    		ymax = Double.parseDouble(extent[3]);
	    double sc_x=w/(xmax-xmin),
	    		sc_y=h/(ymax-ymin);
		//抽稀半径
	    double dis = 10000/(z+1);
	    System.out.println(dis/Degree2Meter);
	    
	    Pos.buf = dis/Degree2Meter;

		//画布建立
        BufferedImage image = new BufferedImage(w, h,BufferedImage.TYPE_INT_RGB);
	    java.awt.Graphics2D g2d = image.createGraphics();
	    image = g2d.getDeviceConfiguration().createCompatibleImage(w,h,java.awt.Transparency.TRANSLUCENT);
	    g2d.dispose();
	    final java.awt.Graphics2D g2d_poi = image.createGraphics();
	    
		JdbcTemplate jdbcTemplate = (JdbcTemplate) SpringUtil.getBean("jdbcTemplate");
		
        long t1 = System.currentTimeMillis();
        String sqlQuery = "select t_long,t_lat from "+layer+" where t_long>="+xmin+" and t_long<="+xmax+" and t_lat>="+ymin+" and t_lat<="+ymax;
        List<Pos> pois = jdbcTemplate.query(new StreamingStatementCreator(sqlQuery),  new ResultSetExtractor<List<Pos>>(){
           	public List<Pos> extractData(ResultSet rs) throws SQLException,DataAccessException 
           	{
           		List<Pos> fc = new ArrayList<Pos>();
           		while(rs.next()){
                   	Pos pos = new Pos(rs.getDouble("t_long"),rs.getDouble("t_lat"));
                	if (!fc.contains(pos)) {
                		fc.add(pos);
                	} 
                }
       		return fc;
       	}});

        
        int num = pois.size();
        int max_nearPoi = 0;
        for(int j = 0;j < num; j++){
        	if(max_nearPoi < pois.get(j).nearPoi){
        		max_nearPoi = pois.get(j).nearPoi;
        	}
        }
        
		for(int k = 0;k < num; k++){
    		double scrx = (pois.get(k).x-xmin)*sc_x,
    				scry = (ymax-pois.get(k).y)*sc_y;     
    		int r = (int) 20.0*pois.get(k).nearPoi/max_nearPoi;    		
    		r = (r < 3)?3 : r;
    
    		RadialGradientPaint rgp = new RadialGradientPaint(
                    new Point((int)scrx, (int)scry),
                    r,
                    new float[]{0f, 1f},
                    new Color[]{Color.RED, new Color(1,0,0,0.0f)}
                    );
            g2d_poi.setPaint(rgp);
            g2d_poi.fill(new Ellipse2D.Double(scrx-r, scry-r, 2*r, 2*r));
		}
		
        
        long t2 = System.currentTimeMillis();  
        System.out.println("Finished Query! "+pois.size()+","+(t2-t1)+"ms");


        g2d_poi.dispose();
	    OutputStream os = response.getOutputStream();
	    try {
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
	    catch (IOException e) {
	        e.printStackTrace();
	    }
	}

}
