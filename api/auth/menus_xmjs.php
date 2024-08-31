<?php
// 设置允许其他域名访问
header('Access-Control-Allow-Origin:*');
// 设置允许的响应类型 
header('Access-Control-Allow-Methods:POST, GET');
// 设置允许的响应头 
header('Access-Control-Allow-Headers:x-requested-with,content-type');

header("Content-type: text/html; charset=utf-8");

require_once('../cors.php');
require_once('../include.inc.php');

CheckAuthUserLoginStatus();

//Get User Role
$USER_ID    = $GLOBAL_USER->USER_ID;
$USER_TYPE  = $GLOBAL_USER->type;

$Menu = ['id'=>'0', 'title' => '网上报修', 'icon' => 'mdi:home-outline', 'path' => '/dashboards/xmjs_wygl', 'category'=>'appsPages'];
$Menus[] = $Menu;

if($USER_TYPE=="User")    {
	$Menu = ['id'=>'1', 'title' => '公开课', 'icon' => 'mdi:home-outline', 'path' => '/dashboards/xmjs_gongkaike', 'category'=>'appsPages'];
	$Menus[] = $Menu;
}

$Menu = [];
$Menu['sectionTitle'] = "应用程序";
$Menus[] = $Menu;

$厦门技师菜单MAP = [];
#########################################################################################################################
if($USER_TYPE=="User")    {
    $菜单列表   = [];
    $菜单列表[] = "报修信息";
    $菜单列表[] = "宿管员审核";
    $菜单列表[] = "报修受理";
    $菜单列表[] = "维修组长派单";
    $菜单列表[] = "确认维修";
    $菜单列表[] = "服务评价";
    $菜单列表[] = "教职工申请公开课";
    $菜单列表[] = "系部审核公开课";
    $菜单列表[] = "教务审核公开课";
    $菜单列表[] = "公开课评价";
    if($USER_ID=="admin" || $USER_ID=="admin001") {
        $sql    = "select * from data_menutwo where FaceTo = 'AuthUser' order by MenuOneName, FlowId";
    }
    else {
        $sql    = "select * from data_menutwo where MenuTwoName in ('".join("','",$菜单列表)."') and FaceTo = 'AuthUser' order by MenuOneName, FlowId";
    }
    $rs     = $db->Execute($sql);
    $rs_a   = $rs->GetArray();
    foreach($rs_a as $Item) {
        $厦门技师菜单MAP[] = $Item['id'];
    }
}
if($USER_TYPE=="Student")    {
    $厦门技师菜单MAP = [386,387,388,390];
}
#########################################################################################################################



if($USER_TYPE=="User")    {
    //Menu From Database
    $sql    = "select * from data_menuone order by SortNumber asc, MenuOneName asc";
    $rsf    = $db->CacheExecute(180,$sql);
    $MenuOneRSA  = $rsf->GetArray();

    if($USER_ID=="admin" || $USER_ID=="admin001") {
        $sql    = "select * from data_menutwo where FaceTo='AuthUser' order by MenuOneName asc,SortNumber asc";
    }
    else {
        $sql    = "select * from data_menutwo where FaceTo='AuthUser' and id in ('".join("','",$厦门技师菜单MAP)."') order by MenuOneName asc,SortNumber asc";
    }
    $rsf    = $db->CacheExecute(180,$sql);
    $MenuTwoRSA  = $rsf->GetArray();
    $MenuTwoArray = [];
    $TabMap = [];
    $TabMapCounter = [];
    foreach($MenuTwoRSA as $Item)  {
        $TabMapCounter[$Item['MenuOneName']][$Item['MenuTwoName']][] = $Item;
    }
    foreach($MenuTwoRSA as $Item)  {
        if($Item['MenuTab']=="Yes"||$Item['MenuTab']=="是") {
            $TabMap[$Item['MenuOneName']][$Item['MenuTwoName']] = "Tab";
        }
        if($Item['MenuThreeName']!="")   {
            $MenuTwoArray[$Item['MenuOneName']][$Item['MenuTwoName']][] = $Item;
        }
        else { 
            $MenuTwoArray[$Item['MenuOneName']]['SystemMenuTwo_'.$Item['id']][] = $Item;
        }
    }

    $MenuOneArray = [];
    foreach($MenuOneRSA as $Item)  {
        $Menu = [];
        $Menu['icon']   = $Item['MenuIcon'];
        $Menu['title']  = $Item['MenuOneName'];
        $MenuOneName    = $Item['MenuOneName'];
        $MenuTwoItemArray = $MenuTwoArray[$Item['MenuOneName']];
        if(is_array($MenuTwoItemArray))    {
            foreach($MenuTwoItemArray as $Name=>$Line)    {
                if($TabMap[$MenuOneName][$Name]=="Tab")  {
                    $allpathItems = $TabMapCounter[$MenuOneName][$Line[0]['MenuTwoName']];
                    $allpath = [];
                    foreach($allpathItems as $TempItem) {
                        $allpath[] = '/tab/apps_'.$TempItem['id'];
                    }
                    $Menu['children'][] = ['title' => $Name, 'path' => '/tab/apps_'.$Line[0]['id'] ,'allpath' =>$allpath ];
                }
                else if(strpos($Name,"SystemMenuTwo_")===0)  {
                    //Menu Two
                    foreach($Line as $ItemTwo) {            
                        if($ItemTwo['FlowId']>0) {
                            $Menu['children'][] = ['title' => $ItemTwo['MenuTwoName'], 'path' => '/apps/'.$ItemTwo['id'] ,'allpath' => [] ];
                        }
                        if($ItemTwo['FlowId']==0&&$ItemTwo['MenuPath']!="") {
                            if($ItemTwo['NewWindow']) {
                                $Menu['children'][] = ['title' => $ItemTwo['MenuTwoName'], 'path' => $ItemTwo['MenuPath'] ,'allpath' => [], 'openInNewTab'=>true, 'externalLink'=>true ];
                            }
                            else {
                                $Menu['children'][] = ['title' => $ItemTwo['MenuTwoName'], 'path' => $ItemTwo['MenuPath'] ,'allpath' => [] ];
                            }
                        }
                    }
                }
                else {
                    //Menu Three
                    $subChildren = [];
                    foreach($Line as $Name3=>$Line3)    {                    
                        $subChildren[] = ['title' => $Line3['MenuThreeName'], 'path' => '/apps/'.$Line3['id'] ];
                    }
                    $Menu['children'][] = ['title' => $Name, 'children' => $subChildren ,'allpath' => [] ];
                }
            }
            $Menus[] = $Menu;
        }
    }
}


if($USER_TYPE=="Student")    {
    //Menu From Database
    $sql    = "select * from data_menuone order by SortNumber asc, MenuOneName asc";
    $rsf    = $db->CacheExecute(180,$sql);
    $MenuOneRSA  = $rsf->GetArray();

    $sql    = "select * from data_menutwo where FaceTo='Student' and id in ('".join("','",$厦门技师菜单MAP)."') order by MenuOneName asc,SortNumber asc";
    $rsf    = $db->CacheExecute(180,$sql);
    $MenuTwoRSA  = $rsf->GetArray();
    $MenuTwoArray = [];
    $TabMap = [];
    $TabMapCounter = [];
    foreach($MenuTwoRSA as $Item)  {
        $TabMapCounter[$Item['MenuOneName']][$Item['MenuTwoName']][] = $Item;
    }
    foreach($MenuTwoRSA as $Item)  {
        if(($Item['MenuTab']=="Yes"||$Item['MenuTab']=="是") && sizeof($TabMapCounter[$Item['MenuOneName']][$Item['MenuTwoName']])>1 ) {
            $TabMap[$Item['MenuOneName']][$Item['MenuTwoName']] = "Tab";
        }
        if($Item['MenuThreeName']!="" && sizeof($TabMapCounter[$Item['MenuOneName']][$Item['MenuTwoName']])>1 )   {
            $MenuTwoArray[$Item['MenuOneName']][$Item['MenuTwoName']][] = $Item;
        }
        else { 
            $MenuTwoArray[$Item['MenuOneName']]['SystemMenuTwo_'.$Item['id']][] = $Item;
        }
    }

    $MenuOneArray = [];
    foreach($MenuOneRSA as $Item)  {
        $Menu = [];
        $Menu['icon']   = $Item['MenuIcon'];
        $Menu['title']  = $Item['MenuOneName'];
        $MenuOneName    = $Item['MenuOneName'];
        $MenuTwoName    = $Item['MenuTwoName'];
        $MenuTwoItemArray = $MenuTwoArray[$Item['MenuOneName']];
        if(is_array($MenuTwoItemArray))    {
            foreach($MenuTwoItemArray as $Name=>$Line)    {
                $allpath = $TabMapCounter[$MenuOneName][$MenuTwoName];
                if($TabMap[$MenuOneName][$Name]=="Tab")  {
                    $allpathItems = $TabMapCounter[$MenuOneName][$Line[0]['MenuTwoName']];
                    $allpath = [];
                    foreach($allpathItems as $TempItem) {
                        $allpath[] = '/tab/apps_'.$TempItem['id'];
                    }
                    $Menu['children'][] = ['title' => $Name, 'path' => '/tab/apps_'.$Line[0]['id'] ,'allpath' =>$allpath ];
                }
                else if(strpos($Name,"SystemMenuTwo_")===0)  {
                    //Menu Two
                    foreach($Line as $ItemTwo) {            
                        if($ItemTwo['FlowId']>0) {
                            $Menu['children'][] = ['title' => $ItemTwo['MenuTwoName'], 'path' => '/apps/'.$ItemTwo['id'] ,'allpath' =>$allpath ];
                        }
                        if($ItemTwo['FlowId']==0&&$ItemTwo['MenuPath']!="") {
                            if($ItemTwo['NewWindow']) {
                                $Menu['children'][] = ['title' => $ItemTwo['MenuTwoName'], 'path' => $ItemTwo['MenuPath'] ,'allpath' => $allpath, 'openInNewTab'=>true, 'externalLink'=>true ];
                            }
                            else {
                                $Menu['children'][] = ['title' => $ItemTwo['MenuTwoName'], 'path' => $ItemTwo['MenuPath'] ,'allpath' => $allpath ];
                            }
                        }
                    }
                }
                else {
                    //Menu Three
                    $subChildren = [];
                    foreach($Line as $Name3=>$Line3)    {                    
                        $subChildren[] = ['title' => $Line3['MenuThreeName'], 'path' => '/apps/'.$Line3['id'] ];
                    }
                    $Menu['children'][] = ['title' => $Name, 'children' => $subChildren ,'allpath' =>$allpath];
                }
            }
            $Menus[] = $Menu;
        }
    }
}


/*
$Menu = [];
$Menu['icon'] = 'mdi:account-outline';
$Menu['title'] = 'User';
$Menu['children'][] = ['title' => 'List', 'icon' => 'mdi:chart-donut', 'path' => '/apps/user/list'];
$subChildren = [];
$subChildren[] = ['title' => 'account', 'icon' => 'mdi:chart-variant', 'path' => '/pages/user-settings/account'];
$subChildren[] = ['title' => 'profile', 'icon' => 'mdi:chart-variant', 'path' => '/pages/user-profile'];
$Menu['children'][] = ['title' => 'View', 'children' => $subChildren];
$Menus[] = $Menu;
*/
print_R(EncryptApiData($Menus));
exit;

