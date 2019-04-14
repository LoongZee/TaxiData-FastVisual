package com.lzh.web;


import java.io.IOException;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.jdbc.core.JdbcTemplate;

import com.lzh.db.SpringUtil;
import com.lzh.web.Model.ComputeTimeBin;


/**
 * Servlet implementation class TimeBin
 */
@WebServlet("/TimeBin")
public class TimeBin extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TimeBin() {
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
		
		
		String layer= request.getParameter("layer");
		int timebin= Integer.parseInt(request.getParameter("timebin"));
		String state= request.getParameter("state");
		String[] state_array = state.split(",");
		int step = (1370880000-1370793600)/timebin;
		List<String> sql_array = new ArrayList<String>();
		int len = state_array.length;
		for(int i = 0; i < step; i++){
			int starttime = 1370793600+timebin*i;
			int endtime = 1370793600+timebin*(i+1);
			String sql = "select count(*) as count from " + layer + " where t_time>="+starttime+" and t_time<"+endtime;
	        if(len == 1){
	        	if(state_array[0].equals("0")){
	        		sql = "select count(*) as count from " + layer + " where t_time>="+starttime+" and t_time<"+endtime+" and t_state=1";
	        	}
	        	else if(state_array[0].equals("1")){
	        		sql = "select count(*) as count from " + layer + " where t_time>="+starttime+" and t_time<"+endtime+" and t_state=17";
	        	}
	        }
			sql_array.add(sql);
			System.out.println(sql);			
		}
		JdbcTemplate jdbcTemplate = (JdbcTemplate) SpringUtil.getBean("jdbcTemplate");
		
        ExecutorService executor = Executors.newCachedThreadPool();  
        List<ComputeTimeBin> Compute = new ArrayList<ComputeTimeBin>();
        int sqlsize = sql_array.size();
        for (int i = 0; i < sqlsize; i++ ){
        	Compute.add(new ComputeTimeBin(jdbcTemplate, sql_array.get(i)));
        }
        
        try {
			List<Future<Integer>> coms = executor.invokeAll(Compute);
			executor.shutdown();
			int size = coms.size();
			String resultbins = "{\"time\":\"1370793600\",\"num\":\"" + ((int)(coms.get(0).get()/1.2)) + "\"},";
			for(int i= 0; i < size; i++){
	            int num = coms.get(i).get();  
	            resultbins += "{\"time\":\""+(1370793600+timebin*(i+1))+"\",\"num\":\""+num+"\"},";
			}
			resultbins = resultbins.substring(0 , resultbins.length()-1);
			String resultstring = "{\"state\":\"good\",\"timebins\":["+resultbins+"]}";
			System.out.println(resultstring);
			out.print(resultstring);
	    }
	    catch (Exception e) {
	        e.printStackTrace();
	    }
		
	    
		
	}

}
