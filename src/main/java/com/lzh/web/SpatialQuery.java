package com.lzh.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

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
 * Servlet implementation class SpatialQuery
 */
@WebServlet("/SpatialQuery")
public class SpatialQuery extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SpatialQuery() {
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
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		
		String geom= request.getParameter("geom");
		String layer= request.getParameter("layer");
		
		String sql = "SELECT t_long,t_lat FROM "+layer+" WHERE ST_Intersects(geom, ST_GeomFromText('"+geom+"'))"; 
		System.out.println(sql);
		JdbcTemplate jdbcTemplate = (JdbcTemplate) SpringUtil.getBean("jdbcTemplate");
		List<Pos> pois = jdbcTemplate.query( new StreamingStatementCreator(sql),   new ResultSetExtractor<List<Pos>>() {  
	        	public List<Pos> extractData(ResultSet rs) throws SQLException,DataAccessException  {
	           		List<Pos> fc = new ArrayList<Pos>();
	           		while(rs.next()){
	                   	Pos pos = new Pos(rs.getDouble("t_long"),rs.getDouble("t_lat"));
	                	if (!fc.contains(pos)) {
	                		fc.add(pos);
	                	} 
	                }
	           		return fc;
	            }
            }
        );
		
		
        int num = pois.size();
        int max_nearPoi = 0;
        for(int j = 0;j < num; j++){
        	if(max_nearPoi < pois.get(j).nearPoi){
        		max_nearPoi = pois.get(j).nearPoi;
        	}
        }
        String resultpoi = "";
 		for(int k = 0; k < num; k++){
 			resultpoi +=("{\"geom\":\"POINT("+ pois.get(k).x +" "+pois.get(k).y+")\",\"nearPoi\":\""+pois.get(k).nearPoi+"\"},");
		}
 		resultpoi = resultpoi.substring(0 , resultpoi.length()-1);
 		String resultstring = "{\"state\":\"good\",\"pois\":["+resultpoi+"],\"max_nearPoi\":\""+max_nearPoi+"\"}";
 		System.out.println(resultstring);
 		out.print(resultstring);
	}

}
