export type GetAllGolfCourseParams = {
  latitude: string;
  longitude: string;
  miles?: string;
  kilometers?: string;
  search?: string;
};

export type GetAllGolfCourseResponseType = {
  status: string;
  statusCode: number;
  data: any[];
  totalCounts: number;
  message: string;
};

export type GetGolfCourseByPlaceIdParams ={
  place_id:string;
  search?: string;
};
export type GetGolfCourseByPlaceIdResponseType = {
  status: string;
  statusCode: number;
  data: any;
  totalCounts: number;
  message: string;
  
};
export type GetWeatherParams ={
  coordinates:{
    latitude:number;
    longitude:number;
  }
 
}
export type GetWeatherResponseType ={
 status: string;
  statusCode: number;
  data: any;
  totalCounts: number;
  message: string;
  time: string;
};

export type SaveGolfSessionResponseType = {
  status: string;
  statusCode: number;
  data: any[];
  totalCounts: number;
  message: string;
};
export type GetHolesResponseType ={
  status: string;
  statusCode: number;
  data: any;
  totalCounts: number;
  message: string;
};