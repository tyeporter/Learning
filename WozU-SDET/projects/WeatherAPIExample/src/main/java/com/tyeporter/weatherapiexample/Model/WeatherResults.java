package com.tyeporter.weatherapiexample.Model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

class Coordinate {

	@JsonProperty("lon")
	public Double longitude;

	@JsonProperty("lat")
	private Double latitude;

	public Coordinate() {}

	public Double getLongitude() {
		return longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

}

class WeatherInfo {

	@JsonProperty("id")
	public int id;

	@JsonProperty("main")
	public String main;

	@JsonProperty("description")
	public String description;

	@JsonProperty("icon")
	public String icon;

	public WeatherInfo() {}

	public int getId() {
		return id;
	}

	public String getMain() {
		return main;
	}

	public String getDescription() {
		return description;
	}

	public String getIcon() {
		return icon;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setMain(String main) {
		this.main = main;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

}

class WeatherDetail {

	@JsonProperty("temp")
	private Double temperature;

	@JsonProperty("feels_like")
	private Double feel;

	@JsonProperty("temp_min")
	private Double minTemperature;

	@JsonProperty("temp_max")
	private Double maxTemperature;

	@JsonProperty("pressure")
	private Double pressure;

	@JsonProperty("humidity")
	private Double humidity;

	public WeatherDetail() {}

	public Double getTemperature() {
		return temperature;
	}

	public Double getFeel() {
		return feel;
	}

	public Double getMinTemperature() {
		return minTemperature;
	}

	public Double getMaxTemperature() {
		return maxTemperature;
	}

	public Double getPressure() {
		return pressure;
	}

	public Double getHumidity() {
		return humidity;
	}

}

class WeatherWind {

	@JsonProperty("speed")
	private Double speed;

	@JsonProperty("deg")
	private int deg;

	@JsonProperty("gust")
	private Double gust;

	public WeatherWind() {}

	public Double getSpeed() {
		return speed;
	}

	public int getDeg() {
		return deg;
	}

	public Double getGust() {
		return gust;
	}

	public void setSpeed(Double speed) {
		this.speed = speed;
	}

	public void setDeg(int deg) {
		this.deg = deg;
	}

	public void setGust(Double gust) {
		this.gust = gust;
	}

}

class WeatherClouds {

	@JsonProperty("all")
	private int cloudiness;

	public WeatherClouds() {}

	public int getCloudiness() {
		return cloudiness;
	}

	public void setCloudiness(int cloudiness) {
		this.cloudiness = cloudiness;
	}

}

class WeatherSys {

	@JsonProperty("type")
	private int type;

	@JsonProperty("id")
	private int id;

	@JsonProperty("country")
	private String country;

	@JsonProperty("sunrise")
	private Long sunriseTime;

	@JsonProperty("sunset")
	private Long sunsetTime;

	public WeatherSys() {}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public Long getSunriseTime() {
		return sunriseTime;
	}

	public void setSunriseTime(Long sunriseTime) {
		this.sunriseTime = sunriseTime;
	}

	public Long getSunsetTime() {
		return sunsetTime;
	}

	public void setSunsetTime(Long sunsetTime) {
		this.sunsetTime = sunsetTime;
	}

}

public class WeatherResults {

	@JsonProperty("coord")
	private Coordinate coordinate;

	@JsonProperty("weather")
	private List<WeatherInfo> moreInfo;

	@JsonProperty("base")
	private String base;

	@JsonProperty("main")
	private WeatherDetail detail;

	@JsonProperty("visibility")
	private int visibility;

	@JsonProperty("clouds")
	private WeatherClouds clouds;

	@JsonProperty("dt")
	private Long dataTime;

	@JsonProperty("sys")
	private WeatherSys sys;

	@JsonProperty("timezone")
	private int timezone;

	@JsonProperty("id")
	private Long id;

	@JsonProperty("name")
	private String name;

	@JsonProperty("cod")
	private int cod;

	public WeatherResults() {}

	public Coordinate getCoordinate() {
		return coordinate;
	}

	public void setCoordinate(Coordinate coordinate) {
		this.coordinate = coordinate;
	}

	public List<WeatherInfo> getMoreInfo() {
		return moreInfo;
	}

	public void setMoreInfo(List<WeatherInfo> moreInfo) {
		this.moreInfo = moreInfo;
	}

	public String getBase() {
		return base;
	}

	public void setBase(String base) {
		this.base = base;
	}

	public WeatherDetail getDetail() {
		return detail;
	}

	public void setDetail(WeatherDetail detail) {
		this.detail = detail;
	}

	public int getVisibility() {
		return visibility;
	}

	public void setVisibility(int visibility) {
		this.visibility = visibility;
	}

	public WeatherClouds getClouds() {
		return clouds;
	}

	public void setClouds(WeatherClouds clouds) {
		this.clouds = clouds;
	}

	public Long getDataTime() {
		return dataTime;
	}

	public void setDataTime(Long dataTime) {
		this.dataTime = dataTime;
	}

	public WeatherSys getSys() {
		return sys;
	}

	public void setSys(WeatherSys sys) {
		this.sys = sys;
	}

	public int getTimezone() {
		return timezone;
	}

	public void setTimezone(int timezone) {
		this.timezone = timezone;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getCod() {
		return cod;
	}

	public void setCod(int cod) {
		this.cod = cod;
	}

}