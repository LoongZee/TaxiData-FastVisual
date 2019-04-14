package com.lzh.web.Model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.ResultSetExtractor;


public class ComputePoi implements Callable<List<Pos>> {  
      
        private JdbcTemplate jdbcTemplate;  
        private PreparedStatementCreator State;
          
        public ComputePoi(JdbcTemplate jdbcTemplate, PreparedStatementCreator State) {  
            this.jdbcTemplate = jdbcTemplate;  
            this.State = State;  
        }  
  
        @Override  
        public List<Pos> call() throws Exception {  
            return  jdbcTemplate.query(State,  new ResultSetExtractor<List<Pos>>(){
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
            }   
}

