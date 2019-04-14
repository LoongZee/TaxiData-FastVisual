package com.lzh.web.Model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.concurrent.Callable;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;

public class ComputeTimeBin implements Callable<Integer>{
	
    private JdbcTemplate jdbcTemplate;  
    private String sql;
      
    public ComputeTimeBin(JdbcTemplate jdbcTemplate, String sql) {  
        this.jdbcTemplate = jdbcTemplate;  
        this.sql = sql;  
    }  

    @Override  
    public Integer call() throws Exception {  
        return  jdbcTemplate.query(sql,  new ResultSetExtractor<Integer>(){
			               	public Integer extractData(ResultSet rs) throws SQLException,DataAccessException 
			               	{
			               		rs.next();
			               	    return rs.getInt("count");
		               	}});
        }   

}
