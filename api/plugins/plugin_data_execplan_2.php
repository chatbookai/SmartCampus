<?php

//FlowName: 学生评价老师

function plugin_data_execplan_2_init_default()  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

function plugin_data_execplan_2_init_default_filter_RS($RS)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    global $FlowId,$AllShowTypesArray;
    //Here is your write code
    //Get All Fields
    $学号   = $GLOBAL_USER->学号;
    $班级   = $GLOBAL_USER->班级;
    $当前学期 = returntablefield('data_xueqi',"当前学期",'是',"学期名称")['学期名称'];

    $sql = "select * from td_edu.edu_pingjia  where 1=1  and 学期='".$当前学期."'";
    $rs   = $db->Execute($sql);
    $rs_a = $rs->GetArray();
    if(sizeof($rs_a) > 0)   {
        $评价信息 = $rs_a[0];
        $RS['评价信息'] = $评价信息;
        $开始时间 = substr($评价信息['开始评价时间'], 5, 10);
        $结束时间 = substr($评价信息['结束评价时间'], 5, 10);
        $MobileEndSecondLineLeft = "开始: ".$开始时间. " 结束: " . $结束时间;
        $MobileEndSecondLineRight = "未评价";
        $MobileEndSecondLineRightColor = "error";
    }
    else {        
        $MobileEndSecondLineLeft = "";
        $MobileEndSecondLineRight = "未评价";
        $MobileEndSecondLineRightColor = "error";
    }

    $sql = "select * from data_execplan  where 1=1  and 班级名称 = '".$班级."'  and 学期名称='".$当前学期."' order by id Desc limit 0,100";
    $rs   = $db->Execute($sql);
    $rs_a = $rs->GetArray();
    $教学计划列表    = [];

    //过滤数据
    $data           = $RS['init_default']['data'];
    $MobileEndData  = $RS['init_default']['MobileEndData'];
    $Counter        = 0;
    foreach($rs_a as $Item) {
        $RS['init_default']['MobileEndData'][$Counter]['EditIcon'] = "mdi:edit-outline";
        $RS['init_default']['MobileEndData'][$Counter]['MobileEndFirstLine'] = $Item['课程名称']." ".$Item['教师姓名'];
        $RS['init_default']['MobileEndData'][$Counter]['MobileEndSecondLineLeft'] = $MobileEndSecondLineLeft;
        $RS['init_default']['MobileEndData'][$Counter]['MobileEndSecondLineLeftColor'] = "primary";
        $RS['init_default']['MobileEndData'][$Counter]['MobileEndSecondLineRight'] = $MobileEndSecondLineRight;
        $RS['init_default']['MobileEndData'][$Counter]['MobileEndSecondLineRightColor'] = $MobileEndSecondLineRightColor;
        $Counter ++;
    }

    print_R(json_encode($RS, true));
    exit;
}

function plugin_data_execplan_2_add_default_data_before_submit()  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

function plugin_data_execplan_2_add_default_data_after_submit($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
    /*
    $sql        = "select * from `$TableName` where id = '$id'";
    $rs         = $db->Execute($sql);
    $rs_a       = $rs->GetArray();
    foreach($rs_a as $Line)  {
        //
    }
    */
}

function plugin_data_execplan_2_edit_default($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    global $FlowId,$AllShowTypesArray;
    //Here is your write code
    //Get All Fields
    $sql = "select * from data_execplan  where 1=1  and id = '".$id."'";
    $rs   = $db->Execute($sql);
    $rs_a = $rs->GetArray();
    if(sizeof($rs_a)>0) {
        $学期名称 = $rs_a[0]['学期名称'];
        $课程名称 = $rs_a[0]['课程名称'];
        $班级名称 = $rs_a[0]['班级名称'];
        $教师名称 = $rs_a[0]['教师名称'];
        $sql = "select * from td_edu.edu_pingjia  where 1=1  and 学期='".$学期名称."'";
        $rs   = $db->Execute($sql);
        $rsx_a = $rs->GetArray();
        if(sizeof($rsx_a) > 0)   {
            $评价信息 = $rsx_a[0];
            $RS['评价信息'] = $评价信息;
        }
    }
    
    $sql                    = "select * from form_configsetting where FlowId='384' and IsEnable='1' order by SortNumber asc, id asc";
    $rs                     = $db->Execute($sql);
    $AllFieldsFromTable     = $rs->GetArray();
    $allFieldsEdit          = getAllFields($AllFieldsFromTable, $AllShowTypesArray, 'EDIT', $FilterFlowSetting=false, $SettingMap);
    $defaultValuesEdit      = [];
    foreach($allFieldsEdit as $ModeName=>$allFieldItem) {
        foreach($allFieldItem as $ITEM) {
            $defaultValuesEdit[$ITEM['name']] = $ITEM['value'];
        }
    }
    
    //Value
    $sql    = "select * from data_gongkaike where id='$id'";
    $rs     = $db->Execute($sql);
    $评价人用户名   = $GLOBAL_USER->学号;
    $开课教师用户名 = $rs->fields['用户名'];
    $班级 = $rs->fields['班级'];
    $类型 = $rs->fields['类型'];
    $课程 = $rs->fields['课程'];
    $时间 = $rs->fields['时间'];
    $节次 = $rs->fields['节次'];
    $sql  = "select * from data_gongkaike_pingjia where 评价人用户名='$评价人用户名' and 开课教师用户名='$开课教师用户名' and 班级='$班级' and 类型='$类型' and 课程='$课程' and 时间='$时间' and 节次='$节次'";
    $rs   = $db->Execute($sql);
    foreach($rs->fields as $Key=>$Value) {
        $defaultValuesEdit[$Key] = $Value;
    }

    //print_R($AllShowTypesArray);
    //print $sql;
    $RS['AllFieldsFromTable'] = $AllFieldsFromTable;
    $RS['edit_default']['allFields']        = $allFieldsEdit;
    $RS['edit_default']['allFieldsMode']    = [['value'=>"Default", 'label'=>__("")]];
    $RS['edit_default']['defaultValues']    = $defaultValuesEdit;
    $RS['edit_default']['dialogContentHeight']  = "90%";
    $RS['edit_default']['submitaction']     = "edit_default_data";
    $RS['edit_default']['componentsize']    = "small";
    if($defaultValuesEdit['提交状态']!='是')            {
        $RS['edit_default']['submittext']       = $SettingMap['Rename_Edit_Submit_Button'];
    }
    $RS['edit_default']['canceltext']       = __("Cancel");
    $RS['edit_default']['titletext']        = $SettingMap['Edit_Title_Name'];
    $RS['edit_default']['titlememo']        = $SettingMap['Edit_Subtitle_Name'];
    $RS['edit_default']['tablewidth']       = 650;
    $RS['edit_default']['submitloading']    = __("SubmitLoading");
    $RS['edit_default']['loading']          = __("Loading");
    
    $RS['forceuse'] = true;
    $RS['status']   = "OK";
    $RS['data']     = $defaultValuesEdit;
    $RS['sql']      = $sql;
    $RS['msg']      = __("Get Data Success");
    print_R(json_encode($RS, true));
    exit;
}

function plugin_data_execplan_2_edit_default_data_before_submit($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

function plugin_data_execplan_2_edit_default_data_after_submit($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

function plugin_data_execplan_2_edit_default_configsetting_data($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
    /*
    $sql        = "select * from `$TableName` where id = '$id'";
    $rs         = $db->Execute($sql);
    $rs_a       = $rs->GetArray();
    foreach($rs_a as $Line)  {
        //
    }
    */
}

function plugin_data_execplan_2_view_default($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

function plugin_data_execplan_2_delete_array($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

function plugin_data_execplan_2_updateone($id)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

function plugin_data_execplan_2_import_default_data_before_submit($Element)  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
    return $Element;
}

function plugin_data_execplan_2_import_default_data_after_submit()  {
    global $db;
    global $SettingMap;
    global $MetaColumnNames;
    global $GLOBAL_USER;
    global $TableName;
    //Here is your write code
}

?>