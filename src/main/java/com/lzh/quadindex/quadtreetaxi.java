package com.lzh.quadindex;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;


public class quadtreetaxi {
	
	static double lng_min = 115.476;
	static double lng_max = 117.498;
	
	static double lat_min = 39.443;
	static double lat_max = 40.982;
	
	static List<Integer> poinum_array= new ArrayList<Integer>();
	static List<String> quad_array= new ArrayList<String>();
	static List<String> coord_array= new ArrayList<String>();

	
	static void data_Division(Connection conn, String quadrant, double lng_min, double lng_max, double lat_min, double lat_max) throws SQLException{

		
		double lng_center = (lng_min + lng_max)/2.0;
		double lat_center = (lat_min + lat_max)/2.0;
		
		Statement statement = conn.createStatement();
		
		//��һ����
		String sql1 = "select count(*) as poinum from lala20130610 where t_long>="+lng_min+" and t_long<"+lng_center+" and t_lat>"+lat_center+" and t_lat<="+lat_max;
		ResultSet rs1 = statement.executeQuery(sql1);
		rs1.next();
		int poinum1 = rs1.getInt(("poinum"));
		rs1.close(); 
		if(poinum1 > 500000){
			String qua = quadrant+"0";
			data_Division(conn, qua , lng_min, lng_center, lat_center, lat_max);
		}
		else if(poinum1 != 0){
			System.out.println("poinum:"+poinum1+",quadrant:"+quadrant+"0"+",sql:"+sql1);
			poinum_array.add(poinum1);
			quad_array.add(quadrant+"0");
			coord_array.add(lng_min+","+lng_center+","+lat_center+","+lat_max);
		} 
			
		//�ڶ�����
		String sql2 = "select count(*) as poinum from lala20130610 where t_long>="+lng_center+" and t_long<"+lng_max+" and t_lat>"+lat_center+" and t_lat<="+lat_max;
		ResultSet rs2 = statement.executeQuery(sql2);
		rs2.next();
		int poinum2 = rs2.getInt(("poinum"));
		rs2.close(); 
		if(poinum2 > 500000){
			String qua = quadrant+"1";
			data_Division(conn, qua , lng_center, lng_max, lat_center, lat_max);
		}
		else if(poinum2 != 0){
			System.out.println("poinum:"+poinum2+",quadrant:"+quadrant+"1"+",sql:"+sql2);
			poinum_array.add(poinum2);
			quad_array.add(quadrant+"1");
			coord_array.add(lng_center+","+lng_max+","+lat_center+","+lat_max);
		} 	
		
		//��������
		String sql3 = "select count(*) as poinum from lala20130610 where t_long>="+lng_min+" and t_long<"+lng_center+" and t_lat>"+lat_min+" and t_lat<="+lat_center;
		ResultSet rs3 = statement.executeQuery(sql3);
		rs3.next();
		int poinum3 = rs3.getInt(("poinum"));
		rs3.close(); 
		if(poinum3 > 500000){
			String qua = quadrant+"2";
			data_Division(conn, qua , lng_min, lng_center, lat_min, lat_center);
		}
		else if(poinum3 != 0){
			System.out.println("poinum:"+poinum3+",quadrant:"+quadrant+"2"+",sql:"+sql3);
			poinum_array.add(poinum3);
			quad_array.add(quadrant+"2");
			coord_array.add(lng_min+","+lng_center+","+lat_min+","+lat_center);
		} 		
		
		//��������
		String sql4 = "select count(*) as poinum from lala20130610 where t_long>="+lng_center+" and t_long<"+lng_max+" and t_lat>"+lat_min+" and t_lat<="+lat_center;
		ResultSet rs4 = statement.executeQuery(sql4);
		rs4.next();
		int poinum4 = rs4.getInt(("poinum"));
		rs4.close(); 
		if(poinum4 > 500000){
			String qua = quadrant+"3";
			data_Division(conn, qua , lng_center, lng_max, lat_min, lat_center);
		}
		else if(poinum4 != 0){
			System.out.println("poinum:"+poinum4+",quadrant:"+quadrant+"3"+",sql:"+sql4);
			poinum_array.add(poinum4);
			quad_array.add(quadrant+"3");
			coord_array.add(lng_center+","+lng_max+","+lat_min+","+lat_center);
		} 		
		
			
		
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String driver = "org.postgresql.Driver";
		String url = "jdbc:postgresql://localhost:5432/bjtaxi";
		String user = "postgres";
		String passd = "";
		passd="123456";
		
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, passd);
			if(!conn.isClosed())
				System.out.println("Succeeded connecting to the Database!");
			data_Division(conn,"",lng_min,lng_max,lat_min,lat_max);
			
			List<Integer> poinum_combine = new ArrayList<Integer>();
			List<String> quad_combine = new ArrayList<String>();
			List<String> coord_combine = new ArrayList<String>();
			for(int i = 0; i < poinum_array.size(); i++ ){
				for(int j = i+1; j < poinum_array.size(); j++){
					int num_poi1 = poinum_array.get(i);
					int num_poi2 = poinum_array.get(j);
					if((num_poi1+num_poi2)<=500000){
						String quad1 = quad_array.get(i);
						String quad2 = quad_array.get(j);
						if(quad1.substring(0, quad1.length()-1).equals(quad2.substring(0, quad2.length()-1))){ //������ͬ
							String quad1_last = quad1.substring(quad1.length()-1, quad1.length()) ;
							String quad2_last = quad2.substring(quad2.length()-1, quad2.length()) ;
							if((quad1_last+quad2_last).equals("01")||
									(quad1_last+quad2_last).equals("02")||
									(quad1_last+quad2_last).equals("13")||
									(quad1_last+quad2_last).equals("23")){
								poinum_combine.add(num_poi1+num_poi2);
								quad_combine.add(quad1+"_"+quad2);
								String[] coord1 = coord_array.get(i).split(",");
								String[] coord2 = coord_array.get(j).split(",");
								if((quad1_last+quad2_last).equals("01")||(quad1_last+quad2_last).equals("23")){
									coord_combine.add(coord1[0]+","+coord2[1]+","+coord1[2]+","+coord1[3]);
								}
								else if((quad1_last+quad2_last).equals("02")||(quad1_last+quad2_last).equals("13")){
									coord_combine.add(coord1[0]+","+coord1[1]+","+coord2[2]+","+coord1[3]);
								}
								poinum_array.remove(i);
								poinum_array.remove(j-1);
								quad_array.remove(i);
								quad_array.remove(j-1);
								coord_array.remove(i);
								coord_array.remove(j-1);
								i--;
								break;
							}						
						}					
					}
				}
			}
			
			poinum_combine.addAll(poinum_array);
			quad_combine.addAll(quad_array);
			coord_combine.addAll(coord_array);
			for(int i = 0; i < poinum_combine.size(); i++ ){
				System.out.println(poinum_combine.get(i)+","+quad_combine.get(i)+",coord:"+coord_combine.get(i));
				}
			for(int i = 0; i < poinum_combine.size(); i++ ){
				String[] coord = coord_combine.get(i).split(",");
				String CreateTableSQL = "create table bj_{0} ( "+
						   "CONSTRAINT pkey_{1} PRIMARY KEY (gid), "+
						   "CONSTRAINT ck_{2} check ( t_long>={3} and t_long<{4} and t_lat>{5} and t_lat<={6} ) "+       
						") INHERITS (bj20130610);";
				
				System.out.println(MessageFormat.format(CreateTableSQL, quad_combine.get(i), quad_combine.get(i), quad_combine.get(i), coord[0], coord[1], coord[2], coord[3]));  
                String btreeSQL = "CREATE INDEX bj_long_lat_idx_{0} ON public.bj_{1} USING btree (t_long, t_lat);";
                System.out.println(MessageFormat.format(btreeSQL, quad_combine.get(i), quad_combine.get(i)));  
                String insertSQL = "INSERT INTO bj_{0} "+
									"SELECT * "+
									"from lala20130610 "+
									"where t_long>={1} and t_long<{2} and t_lat>{3} and t_lat<={4};";
                System.out.println(MessageFormat.format(insertSQL, quad_combine.get(i), coord[0], coord[1], coord[2], coord[3]));  
			}
            
			String FUNCTIONSQL = "CREATE OR REPLACE FUNCTION bj_partition_insert_trigger() "+                     
								"RETURNS TRIGGER AS $$ "+  
								"BEGIN "+  
								    "IF ( NEW.t_long>={0} and NEW.t_long<{1} and NEW.t_lat>{2} and NEW.t_lat<={3} ) THEN "+  
								        "INSERT INTO bj_{4} VALUES (NEW.*); ";
			String[] coord = coord_combine.get(0).split(",");
			FUNCTIONSQL = MessageFormat.format(FUNCTIONSQL, coord[0], coord[1], coord[2], coord[3], quad_combine.get(0));
			
			for(int i = 1; i < coord_combine.size(); i++){
				String temp = "ELSIF ( NEW.t_long>={0} and NEW.t_long<{1} and NEW.t_lat>{2} and NEW.t_lat<={3} ) THEN "+ 
						        "INSERT INTO bj_{4} VALUES (NEW.*); ";
				String[] temp_coord = coord_combine.get(i).split(",");
				temp = MessageFormat.format(temp, temp_coord[0], temp_coord[1], temp_coord[2], temp_coord[3], quad_combine.get(i));
				FUNCTIONSQL +=temp;
			}
			
			FUNCTIONSQL = FUNCTIONSQL+            
							    "ELSE "+  
							        "RAISE EXCEPTION 'out of range. Fix the bj_partition_insert_trigger() function!'; "+  
							    "END IF; "+  
							    "RETURN NULL; "+  
							"END; "+  
							"$$ "+  
							"LANGUAGE plpgsql;";
			System.out.println(FUNCTIONSQL);
			
			String ADDTRIGGER = "CREATE TRIGGER bj_partition_trigger " +
									"BEFORE INSERT ON bj20130610 " +
									"FOR EACH ROW EXECUTE PROCEDURE bj_partition_insert_trigger();";
			System.out.println(ADDTRIGGER);
			
			//table quad_index 
			//lat_min lat_max long_min long_max quad subtable 
			for(int i = 0; i<coord_combine.size(); i++){
				String[] temp_coord = coord_combine.get(i).split(",");
				String INSERTSQL = "insert into quad_index values("+temp_coord[2]+","+temp_coord[3]+","+temp_coord[0]+","+temp_coord[1]+","+poinum_combine.get(i)+",'"+quad_combine.get(i)+"','bj_"+quad_combine.get(i)+"');";
				System.out.println(INSERTSQL);
			}
			

			}catch(ClassNotFoundException e) {   
				System.out.println("Sorry,can`t find the Driver!");   
				e.printStackTrace();   
				} catch(SQLException e) {   
					e.printStackTrace();  
					} catch(Exception e) {   
						e.printStackTrace();
						}  
		

	}

}
