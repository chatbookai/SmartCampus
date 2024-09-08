<?php

// #################################################################################
// Database Settting
$DB_TYPE        = 'mysqli';
$DB_HOST        = 'localhost:3386';
$DB_USERNAME    = 'root';
$DB_PASSWORD    = '6jF0^#12x6^S2zQ#t';
$DB_DATABASE    = 'myedu';

// To allow other domains to access your back end api:
global $allowedOrigins;
$allowedOrigins = [];
$allowedOrigins[] = 'http://localhost:3000';
$allowedOrigins[] = 'http://data.dandian.net:8026';

// Setting Default Language for user
global $GLOBAL_LANGUAGE;
$GLOBAL_LANGUAGE = "zhCN";

//File Storage Method And Location
$FileStorageMethod      = "disk";
$FileStorageLocation    = "D:/MYEDU/Attach";
$ADODB_CACHE_DIR        = "D:/MYEDU/Attach/Cache";
$FileCacheDir           = "D:/MYEDU/Attach/FileCache";

//Setting JWT
$NEXT_PUBLIC_JWT_EXPIRATION = 300;

//Setting NEXT_PUBLIC_JWT_SECRET value, need to change other value once you online your site.
$NEXT_PUBLIC_JWT_SECRET = 'kFNRSI6Ilx1NWI2Nlx1Ox1NjUzNlx1NTNkMVx1OTBhZVx';

//Setting EncryptAESKey value, need to change other value once you online your site.
global $EncryptAESKey;
$EncryptAESKey = "c8e2e3669f3a0d081b6b7d7ea185be21c76ad2f399217b8d12cbf57064809d1d";

//Setting EncryptDataAESKey value, need to change other value once you online your site. 固定长度 32位
global $EncryptApiDataAESKey; 
$EncryptApiDataAESKey = "fbae1da1c3f10b1ce0c75c8f5d3319d0";

// 14dadf80d224a1bad3a22a0bc30269022f5d6433a8cbe10ffddc83410de9e983

// #################################################################################
// Not need to change
global $EncryptAESIV;
$EncryptAESIV = random_bytes(16);

//System Mark
global $SystemMark;
$SystemMark = "Individual";