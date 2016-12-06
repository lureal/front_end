/**
 * 门户网页配置文件
 * 保存门户网页的相关数据，如，每个侧边栏的项名和每个项名对应的内容等等的配置项都可以放
 * 在这里
 */
module.exports = {

    // 顶部横栏
    sidebars: [
        {
            title: '首页',
            url: '/boss/portal/index?menuId=163'
        },
        {
            title: '会议室预订',
            url: '/boss/meeting/book-meeting?menuId=163'
        },
        {
            title: '站内信'
        },
        {
            title: '图书馆',
            url: '/boss/library/borrow-list?menuId=147'
        },
        {
            title: '公告栏',
            url: '/boss/portal/notice?menuId=163'
        },
        {
            title: '通讯录',
            url: '/boss/system/mail-list'
        },
        {
            title: '数据统计',
            url: '/boss/report/my-cust-list?menuId=7'
        },
        {
            title: '数据补录',
            url: '/boss/data/product-list?menuId=9'
        },
        {
            title: '资产管理',
            url: '/boss/asset/my-record?menuId=104'
        },
        // {
        //     title: '考勤',
        //     url: '/boss/attendance/my-record?menuId=119'
        // },
        {
            title: '环评',
            url: '/boss/grade/my-score?menuId=125'
        },
        {
            title: '系统管理',
            url: '/boss/system/user-list?menuId=14'
        }
    ],

    // 侧边栏的每个项及每个项下的内容
    sections: [
        {
            id: 0,
            title: '首页', // 导航名称
            banner: {
                title: '首页', // banner 标题
                description: '微思敦，专注移动营销，创造品效合一新格局', // banner 描述
                pic: '/#proj_name#/img/top_img_9.png' // banner 图片
            },
            items: [
                [
                    {
                        title: '销售易', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_xsy.png', // logo
                        url: 'https://crm.xiaoshouyi.com', // 链接
                        isRowOnly: true, // 标识当前是否独占一行
                        description: '（工作圈，CRM，流程审批，知识库）' // 如果当前独占一行，这里存储描述字段
                    }
                ],
                [
                    {
                        title: '微思敦官网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_wesdom.png', // logo
                        url: 'http://www.wesdom.me/' // 链接
                    },
                    {
                        title: 'APP干货铺子', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_app.png', // logo
                        url: 'http://appganhuo.com/' // 链接
                    },
                    {
                        title: '友钱官网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_iyq.png', // logo
                        url: 'http://www.iyouqian.com/' // 链接
                    }
                ],
                [
                    // {
                    //     title: '直客业务流程指引', // 名称
                    //     className: '', // 类名
                    //     logo: '/#proj_name#/img/s_ic_file.png', // logo
                    //     url: '/doc/wesdom_sales_process_guide-0822.xmind' // 链接
                    // },
                    // {
                    //     title: '公司介绍_APP', // 名称
                    //     className: '', // 类名
                    //     logo: '/#proj_name#/img/s_ic_file.png', // logo
                    //     url: '/doc/wesdom_description-app.pptx' // 链接
                    // },
                    // {
                    //     title: '公司介绍_非APP', // 名称
                    //     className: '', // 类名
                    //     logo: '/#proj_name#/img/s_ic_file.png', // logo
                    //     url: '/doc/wesdom_description-nonapp.pptx' // 链接
                    // },
                    {
                        title: '办公电脑配置方案', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_file.png', // logo
                        url: '/doc/computer.pdf' // 链接
                    },
                    {
                        title: '行政管理规定', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_file.png', // logo
                        url: '/doc/administration-manage.pdf' // 链接
                    },
                    {
                        title: '出差费用报销规范', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_file.png', // logo
                        url: '/doc/business-trip.pdf' // 链接
                    },
                    {
                        title: '员工手册', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_file.png', // logo
                        url: '/doc/employee_handbook.docx' // 链接
                    },
                    {
                        title: '制度解析', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_file.png', // logo
                        url: '/doc/Systemic_Analysis.xlsx' // 链接
                    }
                ],
                [
                    {
                        title: '会议室预订', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_huiyi.png', // logo
                        url: '/boss/meeting/book-meeting?menuId=163' // 链接
                    },
                    {
                        title: '图书馆', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_tushu.png', // logo
                        url: '/boss/library/borrow-list?menuId=147' // 链接
                    },
                    {
                        title: '通讯录', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_tongxun.png', // logo
                        url: '/boss/system/mail-list' // 链接
                    },
                    {
                        title: '数据统计', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_shuju.png', // logo
                        url: '/boss/report/my-cust-list?menuId=7' // 链接
                    },
                    {
                        title: '资产管理', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_zichan.png', // logo
                        url: '/boss/asset/my-record?menuId=104' // 链接
                    }
                ]
            ]
        },
        {
            id: 1,
            title: '投放平台', // 导航名称
            banner: {
                title: '投放平台', // banner 标题
                description: '精准定位受众，实时有效的广告投放管理', // banner 描述
                pic: '/#proj_name#/img/top_img_1.png' // banner 图片
            },
            items: [
                [
                    {
                        title: '友钱后台', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_iyq.png', // logo
                        url: 'http://www.iyouqian.com/boss/' // 链接
                    },
                    {
                        title: '广点通', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_gdt.png', // logo
                        url: 'http://e.qq.com/' // 链接
                    },
                    {
                        title: '智汇推', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_zht.png', // logo
                        url: 'http://tui.qq.com' // 链接
                    },
                    {
                        title: '微信公众平台服务商后台', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_wechat.png', // logo
                        url: 'https://a.weixin.qq.com' // 链接
                    },
                    {
                        title: '扶翼', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_fy.png', // logo
                        url: 'http://agent.pfp.sina.com.cn/login.html' // 链接
                    },
                    {
                        title: '今日头条', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_jrtt.png', // logo
                        url: 'http://ad.toutiao.com/agent' // 链接
                    }
                ],
                [
                    {
                        title: '搜狐汇算客户后台', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_sh.png', // logo
                        url: 'http://hui.sohu.com/advertiser' // 链接
                    },
                    {
                        title: '小米', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_xm.png', // logo
                        url: 'https://account.xiaomi.com/' // 链接
                    },
                    {
                        title: '百度', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_baidu.png', // logo
                        url: 'http://baitong.baidu.com/login.html' // 链接
                    },
                    {
                        title: '360', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_360.png', // logo
                        url: 'http://e.360.cn/' // 链接
                    },
                    {
                        title: '粉丝通', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_weibo.png', // logo
                        url: 'http://pro.weibo.com/public/login' // 链接
                    },
                    {
                        title: '陌陌', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_momo.png', // logo
                        url: 'http://ad.immomo.com/ad/home/login' // 链接
                    }
                ]
            ]
        },
        {
            id: 2,
            title: '内部协作',
            banner: {
                title: '内部协作',
                description: '进程及时同步，加速沟通与合作',
                pic: '/#proj_name#/img/top_img_2.png'
            },
            items: [
                [
                    {
                        title: 'Redmine', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_redmine.png', // logo
                        url: 'http://h.iyq.me/redmine/login' // 链接
                    },
                    {
                        title: '销售易', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_xsy.png', // logo
                        url: 'https://crm.xiaoshouyi.com' // 链接
                    }
                ]
            ]
        },
        {
            id: 3,
            title: '查询工具',
            banner: {
                title: '查询工具',
                description: '多工具汇总整合，查询数据便捷高效',
                pic: '/#proj_name#/img/top_img_3.png'
            },
            items: [
                [
                    {
                        title: 'QuestMobile', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_quest.png', // logo
                        url: 'http://www.questmobile.com.cn/#page1' // 链接
                    },
                    {
                        title: 'ASO100', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_aso100.png', // logo
                        url: 'http://aso100.com' // 链接
                    },
                    {
                        title: 'CQASO', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_cqaso.png', // logo
                        url: 'http://cqaso.com' // 链接
                    },
                    {
                        title: '天眼查', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_tyc.png', // logo
                        url: 'http://www.tianyancha.com' // 链接
                    },
                    {
                        title: '百度指数', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_baidu.png', // logo
                        url: 'http://index.baidu.com/' // 链接
                    },
                    {
                        title: '启信宝', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_qxb.png', // logo
                        url: 'http://www.qixin.com/' // 链接
                    }
                ],
                [
                    {
                        title: '自媒体信息查询新榜', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_xb.png', // logo
                        url: 'http://www.newrank.cn/' // 链接
                    },
                    {
                        title: '微指数', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_wzs.png', // logo
                        url: 'http://data.weibo.com/index' // 链接
                    },
                    {
                        title: '数据之眼', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_sjzy.png', // logo
                        url: 'https://www.dataeye.com/' // 链接
                    },
                    {
                        title: 'APP竞品大数据平台', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_appdu.png', // logo
                        url: 'http://www.appduu.com/' // 链接
                    },
                    {
                        title: 'APPBK', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_appbk.png', // logo
                        url: 'http://appbk.com/index.html#/' // 链接
                    },
                    {
                        title: 'TD', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_td.png', // logo
                        url: 'http://www.talkingdata.com/index/#/datareport/-1/zh_cn' // 链接
                    }
                ],
                [
                    {
                        title: 'DCCI互联网数据中心', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_dicc.png', // logo
                        url: 'http://www.dcci.com.cn/' // 链接
                    }
                ]
            ]
        },
        {
            id: 8,
            title: '资讯网站',
            banner: {
                title: '资讯网站',
                description: '聚焦互联网，关注社会变化，读懂行业需求',
                pic: '/#proj_name#/img/top_img_8.png'
            },
            items: [
                [
                    {
                        title: '姑婆那些事儿', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_gupo.png', // logo
                        url: 'http://www.gupowang.com/' // 链接
                    },
                    {
                        title: 'APP营', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_appying.png', // logo
                        url: 'http://www.appying.com/' // 链接
                    },
                    {
                        title: '鸟哥笔记', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_niaoge.png', // logo
                        url: 'http://www.niaogebiji.com/' // 链接
                    },
                    {
                        title: '手游那点事', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_sykong.png', // logo
                        url: 'http://www.sykong.com/' // 链接
                    },
                    {
                        title: '手游圈内人', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_syqnr.png', // logo
                        url: 'http://www.syqnr.com/' // 链接
                    },
                    {
                        title: '拇指巴士', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_muzhi.png', // logo
                        url: 'http://www.muzhibus.com/' // 链接
                    }
                ],
                [
                    {
                        title: 'DEVstore', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_dev.png', // logo
                        url: 'http://www.devstore.cn/' // 链接
                    },
                    {
                        title: '馒头商学院', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_metdu.png', // logo
                        url: 'http://www.mtedu.com/' // 链接
                    },
                    {
                        title: '优派网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_yopai.png', // logo
                        url: 'http://www.yopai.com/' // 链接
                    },
                    {
                        title: '豆瓣广告', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_douban.png', // logo
                        url: 'https://site.douban.com/doubanad/' // 链接
                    },
                    {
                        title: '视觉中国', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_shijue.png', // logo
                        url: 'http://www.visualchina.com/' // 链接
                    },
                    {
                        title: '易观智库', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_yiguan.png', // logo
                        url: 'http://www.analysys.cn/' // 链接
                    }
                ],
                [
                    // {
                    //     title: '微思敦官网', // 名称
                    //     className: '', // 类名
                    //     logo: '/#proj_name#/img/s_ic_wesdom.png', // logo
                    //     url: 'http://www.wesdom.me/' // 链接
                    // },
                    {
                        title: '猫取广告', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_cat.png', // logo
                        url: 'http://www.catchad.com.tw/' // 链接
                    },
                    {
                        title: '中文业界资讯站', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_cnbeta.png', // logo
                        url: 'http://www.cnbeta.com/index.htm' // 链接
                    },
                    {
                        title: 'DONEWS', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_donews.png', // logo
                        url: 'http://www.donews.com/' // 链接
                    },
                    {
                        title: 'I黑马网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_iheima.png', // logo
                        url: 'http://www.iheima.com/' // 链接
                    },
                    {
                        title: 'TECHWEB', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_techweb.png', // logo
                        url: 'http://www.techweb.com.cn/' // 链接
                    },
                    {
                        title: '36氪创投资讯', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_kr.png', // logo
                        url: 'http://36kr.com/' // 链接
                    }
                ],
                [
                    
                    {
                        title: '梅花网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_meihua.png', // logo
                        url: 'http://www.meihua.info/' // 链接
                    },
                    {
                        title: '营销智库', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_domarket.png', // logo
                        url: 'http://www.domarketing.org/' // 链接
                    },
                    {
                        title: '钛媒体', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_tmtpost.png', // logo
                        url: 'http://www.tmtpost.com/' // 链接
                    },
                    {
                        title: '优米网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_youmi.png', // logo
                        url: 'http://www.youmi.cn/' // 链接
                    },
                    {
                        title: '互动中国', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_hudong.png', // logo
                        url: 'http://www.damndigital.com' // 链接
                    },
                    {
                        title: '知微传播分析', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_zhiwei.png', // logo
                        url: 'http://www.weiboreach.com/' // 链接
                    }
                ],
                [
                    
                    {
                        title: '中国企业家网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_qiye.png', // logo
                        url: 'http://www.iceo.com.cn/' // 链接
                    },
                    {
                        title: '艾瑞', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_airui.png', // logo
                        url: 'http://www.iresearch.cn/' // 链接
                    },
                    {
                        title: '极客公园', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_jike.png', // logo
                        url: 'http://www.geekpark.net/' // 链接
                    }
                ]
            ]
        },
        {
            id: 4,
            title: '素材库',
            banner: {
                title: '素材库',
                description: '素材大收罗，让你的库存丰富又精美',
                pic: '/#proj_name#/img/top_img_4.png'
            },
            items: [
                [
                    {
                        title: '花瓣网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_huaban.png', // logo
                        url: 'http://huaban.com/' // 链接
                    },
                    {
                        title: '站酷网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_zcool.png', // logo
                        url: 'http://www.zcool.com.cn/' // 链接
                    },
                    {
                        title: 'UI中国', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_ui.png', // logo
                        url: 'http://www.ui.cn/' // 链接
                    },
                    {
                        title: 'Behance', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_behance.png', // logo
                        url: 'https://www.behance.net/' // 链接
                    },
                    {
                        title: 'Dribbble', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_dribble.png', // logo
                        url: 'https://dribbble.com/' // 链接
                    },
                    {
                        title: '优设UISDC', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_uisdc.png', // logo
                        url: 'http://www.uisdc.com/' // 链接
                    }
                ],
                [
                    {
                        title: 'Iconfont', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_iconfont.png', // logo
                        url: 'http://www.iconfont.cn/' // 链接
                    },
                    {
                        title: 'Pexels图库', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_peise.png', // logo
                        url: 'https://www.pexels.com/' // 链接
                    },
                    {
                        title: '千图网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_58pic.png', // logo
                        url: 'http://www.58pic.com/' // 链接
                    },
                    {
                        title: '优美图', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_topit.png', // logo
                        url: 'http://www.topit.me/' // 链接
                    },
                    {
                        title: '微美设计', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_vemev.png', // logo
                        url: 'http://www.vemev.com/page/6/' // 链接
                    },
                    {
                        title: 'color scheme designer', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_peise.png', // logo
                        url: 'http://www.peise.net/tools/web/' // 链接
                    }
                ]
            ]
        },
        {
            id: 5,
            title: '设计天地',
            banner: {
                title: '设计天地',
                description: '日常充能必备，涨知识学技巧，练就像素眼',
                pic: '/#proj_name#/img/top_img_5.png'
            },
            items: [
                [
                    {
                        title: 'iOS人机设计指南', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_ios.png', // logo
                        url: 'https://developer.apple.com/ios/human-interface-guidelines/' // 链接
                    },
                    {
                        title: 'Google Meterial Design', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_md.png', // logo
                        url: 'https://material.google.com/' // 链接
                    },
                    {
                        title: 'Font Awesome', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_font.png', // logo
                        url: 'https://fortawesome.github.io/Font-Awesome/icons/' // 链接
                    },
                    {
                        title: '阿里巴巴国际UED', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_alibaba.png', // logo
                        url: 'http://www.aliued.com/' // 链接
                    },
                    {
                        title: '腾讯ISUX', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_isux.png', // logo
                        url: 'https://isux.tencent.com/' // 链接
                    },
                    {
                        title: '腾讯CDC', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_cdc.png', // logo
                        url: 'http://cdc.tencent.com/' // 链接
                    }
                ],
                [
                    {
                        title: '造字工房', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_make.png', // logo
                        url: 'http://makefont.com/fonts.html' // 链接
                    },
                    {
                        title: '设计师网址导航', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_uisdc.png', // logo
                        url: 'http://hao.uisdc.com/' // 链接
                    },
                    {
                        title: '全景网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_qj.png', // logo
                        url: 'http://www.quanjing.com/' // 链接
                    },
                    {
                        title: '人人都是产品经理', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_rr.png', // logo
                        url: 'http://www.woshipm.com/' // 链接
                    }
                ]
            ]
        },
        {
            id: 6,
            title: '策划大师',
            banner: {
                title: '策划大师',
                description: '文字讲故事，排版说情绪，样样信手拈来',
                pic: '/#proj_name#/img/top_img_6.png'
            },
            items: [
                [
                    {
                        title: 'APP干货铺子', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_app.png', // logo
                        url: 'http://boss.appganhuo.com/' // 链接
                    },
                    {
                        title: '姑婆那些事', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_gupo.png', // logo
                        url: 'http://www.gupowang.com/' // 链接
                    },
                    {
                        title: '顶尖文案网', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_topy.png', // logo
                        url: 'http://www.topys.cn/' // 链接
                    },
                    {
                        title: '广告门案例库', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_creative.png', // logo
                        url: 'http://creative.adquan.com/' // 链接
                    },
                    {
                        title: 'AdMaker', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_admaker.png', // logo
                        url: 'http://admaker.qq.com/' // 链接
                    },
                    {
                        title: '腾讯风铃H5建站', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_fn.png', // logo
                        url: 'http://zhan.qq.com/' // 链接
                    }
                ],
                [
                    {
                        title: '秀米', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_xiumi.png', // logo
                        url: 'http://xiumi.us/' // 链接
                    },
                    {
                        title: '石墨文档', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_shimo.png', // logo
                        url: 'https://shimo.im/' // 链接
                    }
                ]
            ]
        },
        {
            id: 7,
            title: '测试环境',
            banner: {
                title: '测试环境',
                description: '技术开发阵地，我们的目标是：没有BUG',
                pic: '/#proj_name#/img/top_img_7.png'
            },
            items: [
                [
                    {
                        title: '微思敦官网测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-www.wesdom.cc/' // 链接
                    },
                    {
                        title: '微思敦官网后台测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-boss.wesdom.cc/wesdom-admin/user/login' // 链接
                    },
                    {
                        title: '微思敦官网H5测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-m.wesdom.cc' // 链接
                    },
                    {
                        title: '干货铺子官网测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-www.appganhuo.cc/' // 链接
                    },
                    {
                        title: '干货铺子后台测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-boss.appganhuo.cc/puzi-admin/user/login' // 链接
                    },
                    // {
                    //     title: 'WeAD测试环境', // 名称
                    //     className: '', // 类名
                    //     logo: '', // logo
                    //     url: 'http://test-cp.wead.cc/dsp/manage/overview/index' // 链接
                    // },

                    
                    {
                        title: '企业门户测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-b.wesdom.cc/boss/user/login' // 链接
                    }
                ],
                [
                    {
                        title: '客户管理平台测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-cp.wead.cc' // 链接
                    },
                    {
                        title: 'DSP投放平台测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test-dsp.wead.cc' // 链接
                    },
                    
                    // {
                    //     title: '客户管理系统管理后台', // 名称
                    //     className: '', // 类名
                    //     logo: '', // logo
                    //     url: 'http://wdsp.iyq.me/wead/admin/customer/index' // 链接
                    // },
                    {
                        title: '友钱后台测试环境', // 名称
                        className: '', // 类名
                        logo: '', // logo
                        url: 'http://test.iyq.me/boss/login_index/?next=/boss/' // 链接
                    }
                ]
            ]
        },
        {
            id: 9,
            title: '客户线索',
            banner: {
                title: '客户线索',
                description: '当你正在寻找客户的时候，客户也在寻找你',
                pic: '/#proj_name#/img/top_img_10.png'
            },
            items: [
                [
                    {
                        title: 'IT桔子', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_it.png', // logo
                        url: 'https://www.itjuzi.com/ ' // 链接
                    },
                    {
                        title: '小米应用市场', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_xmyy.png', // logo
                        url: 'http://app.mi.com' // 链接
                    },
                    {
                        title: '天使汇', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_tsh.png', // logo
                        url: 'http://angelcrunch.com/' // 链接
                    },
                    {
                        title: '酷传', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_kc.png', // logo
                        url: 'http://jk.coolchuan.com/report/total-downloads' // 链接
                    },
                    {
                        title: '创业邦', // 名称
                        className: '', // 类名
                        logo: '/#proj_name#/img/s_ic_chuang.png', // logo
                        url: 'http://capital.cyzone.cn/' // 链接
                    }
                ]
            ]
        }
    ]
};
