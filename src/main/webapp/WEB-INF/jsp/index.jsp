<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>
<c:set var="basePath" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Floating Vehicle Visualization System</title>
    <script>var BASE_PATH = '${basePath}';</script>
    <!-- jquery & jquery-ui -->
    <script src="${basePath}/resources/lib/jquery/jquery.min.js" type="text/javascript"></script>
    <script src="${basePath}/resources/lib/jquery/jquery-ui.min.js"></script>
    
    <!-- bootstrap -->
    <script src="${basePath}/resources/lib/bootstrap-3.3.6/js/bootstrap.min.js" type="text/javascript"></script>
    <link rel="stylesheet" href="${basePath}/resources/lib/bootstrap-3.3.6/css/bootstrap.min.css">
    
    <!-- ol-3.20.1 -->
    <script src="${basePath}/resources/lib/ol-3.20.1/ol.js" type="text/javascript"></script>
    <link rel="stylesheet" href="${basePath}/resources/lib/ol-3.20.1/ol.css" type="text/css">
    
    <!-- js & css -->
    <script src="${basePath}/resources/framework/public_Lib.js" type="text/javascript"></script>
    <script src="${basePath}/resources/js/initFunction.js" type="text/javascript"></script>
    <link rel="stylesheet" href="${basePath}/resources/style/style.css" type="text/css">
    <link rel="stylesheet" href="${basePath}/resources/style/custom-controls.css" type="text/css">
</head>
<body>
    <div id="map"></div>
</body>
</html>