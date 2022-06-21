const axios = require("axios");
const bodyParser = require('body-parser');
const express = require("express");
const asyncHandler = require('express-async-handler');
const qs = require('querystring');

const app = express();

app.use(bodyParser.json());	// json 등록
app.use(bodyParser.urlencoded({ extended : false }));

const port = 3500;

const { Client } = require('pg');

const { DB_INFO, APOD_API_KEY, P_CLIENT_ID, P_CLIENT_SECRET } = require('./info');

const client = new Client({
    user : DB_INFO.user,
    host : DB_INFO.host,
    database : DB_INFO.database,
    password : DB_INFO.password,
    port : DB_INFO.port,
});

client.connect();

async function getApod(_from, _to){
	
    const API_KEY = APOD_API_KEY;
    
    try{
    	const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${_from}&end_date=${_to}`).then(res => res.data);
        insertData(response);
        return response;
    } catch(error){
        return "ERROR";
    }
}

async function translate(_originText) {;
   
    // const CLIENT_ID = 'vCMt9kip4TSxL5JUEM0h';
    // const CLIENT_SECRET = 'QIotQo3QgJ';
    const CLIENT_ID = P_CLIENT_ID;
    const CLIENT_SECRET = P_CLIENT_SECRET;
    let originText = _originText;
   
    let API_URL = 'https://openapi.naver.com/v1/papago/n2mt';

    const params = qs.stringify({
        source: 'en',
        target: 'ko',
        text: originText,
    });

    const config = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-naver-client-id': CLIENT_ID,
            'x-naver-client-secret': CLIENT_SECRET,
        },
    };

    const response = await axios.post(API_URL, params, config);
    
    return response.data.message.result.translatedText;
 };

function insertData(_result) {

    let values = [];
    let sql = "INSERT INTO NASA_API_APOD"
    if (_result.translate_title !== null && _result.translate_title !== null) {
        sql += " (date, explanation, hdurl, media_type, service_version, title, url, translate_title, translate_explanation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
        
        values = [_result.date, _result.explanation, _result.hdurl, _result.media_type, _result.service_version, _result.title, _result.url
                    , _result.translate_title, _result.translate_explanation];
    } else {
        sql += " (date, explanation, hdurl, media_type, service_version, title, url) VALUES ($1, $2, $3, $4, $5, $6, $7)"
        
        values = [_result.date, _result.explanation, _result.hdurl, _result.media_type, _result.service_version, _result.title, _result.url];
    }
    
    sql += " ON CONFLICT ON CONSTRAINT nasa_api_apod_pk DO UPDATE "
    sql += " SET "
    sql += "    TRANSLATE_TITLE = '" + _result.translate_title + "' "
    sql += "    , TRANSLATE_EXPLANATION = '" + _result.translate_explanation + "' "
    sql += " RETURNING *";
    

    client.query(sql, values, (err, res) => {
        if (err) {
            // console.log(err.stack)
        } else {
            // console.log(res);
        }
    });

 }


app.post("/insertData", asyncHandler(async (req, res, next) => {
  
    const params = req.body;

    const result = await getApod(params.start_date, params.end_date);    
    
    for(let i=0; i<result.length; i++) {
        insertData(result[i]);
    }
    
    res.end();
}));

app.get("/:targetDate", asyncHandler(async (req, res, next) => {
    let sql = "SELECT * FROM NASA_API_APOD WHERE DATE = $1";
    const targetDate = req.params.targetDate;
    const values = [targetDate];

    let convertObj = {}
    
    client.query(sql, values, async(err, result) => {
        if (err) {
            // console.log(err.stack)
        } else {
            convertObj = { ...result.rows[0] };

            if (convertObj.date) {


                if (convertObj.translate_explanation) {
                    // console.log('번역있음')
                } else {
                    convertObj.translate_explanation = await translate(convertObj.explanation);
                    convertObj.translate_title  = await translate(convertObj.title);
                    insertData(convertObj);
                }

                res.json(convertObj);

            } else {
                convertObj = await getApod(targetDate, targetDate);

                if (convertObj === "ERROR") {
                    res.status(400).json({
                        status: 'error'
                    });
                } else {
                    convertObj.translate_explanation = await translate(convertObj.explanation);
                    convertObj.translate_title = await translate(convertObj.title);
                    insertData(convertObj);
                    res.json(convertObj);
                }
                
            }

            

        }

    });

    


}))

// port middleware
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});