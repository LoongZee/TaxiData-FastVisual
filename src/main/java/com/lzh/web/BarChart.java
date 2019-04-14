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
 * Servlet implementation class BarChart
 */
@WebServlet("/BarChart")
public class BarChart extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public BarChart() {
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
		int start= Integer.parseInt(request.getParameter("start"));
		int end= Integer.parseInt(request.getParameter("end"));
		
		
	
		List<String> sql_array = new ArrayList<String>();
		String sql = "select count(*) as count from " + layer + " where t_state=1"+" and t_time>"+start+" and t_time<"+end;
		String sql1 = "select count(*) as count from " + layer + " where t_state=17"+" and t_time>"+start+" and t_time<"+end;;
		sql_array.add(sql);
		sql_array.add(sql1);
		
		JdbcTemplate jdbcTemplate = (JdbcTemplate) SpringUtil.getBean("jdbcTemplate");
        ExecutorService executor = Executors.newCachedThreadPool();  
        List<ComputeTimeBin> Compute = new ArrayList<ComputeTimeBin>();
        for (int i = 0; i < 2; i++ ){
        	Compute.add(new ComputeTimeBin(jdbcTemplate, sql_array.get(i)));
        }
        
        try {
			List<Future<Integer>> coms = executor.invokeAll(Compute);
			executor.shutdown(); 
	        String resultbins = "{\"status\":\"up\",\"num\":\""+coms.get(0).get()+"\"},{\"status\":\"down\",\"num\":\""+coms.get(1).get()+"\"}";
			String resultstring = "{\"state\":\"good\",\"data\":["+resultbins+"]}";
			System.out.println(resultstring);
			out.print(resultstring);
	    }
	    catch (Exception e) {
	        e.printStackTrace();
	    }
		
	}

}
