<?php
namespace frontend\controllers;

use Yii;
use common\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use yii\base\InvalidParamException;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;

/**
 * Site controller
 */
class SiteController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout', 'signup'],
                'rules' => [
                    [
                        'actions' => ['signup'],
                        'allow' => true,
                        'roles' => ['?'],
                    ],
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
           // 'error' => [
            //    'class' => 'yii\web\ErrorAction',
           // ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {
        return $this->render('index');
    }
	
	public function actionQetdays()
    {
		//tmo =  -(date).getTimezoneOffset()
		$time_zone_offset = Yii::$app->request->get('tmo');


		
	  
		$db_params = array(
			"start_arr" => [1 => 9, 2 => 10, 3 =>5 ],
			"stop_arr" => [1 => 19, 2 => 12, 3 =>15 ],
			"weekday" => "1,2,3,4,5",
			"time_zone" => "America/Adak",		
		);
	  
		?>		
		<pre>
			<?php
				print_r(  $db_params );
			?>
		</pre>		
		
		
		<?date_default_timezone_set( "UTC" );
		
	
		
		//ТАИМ ЗОНА ХОЗЯИНА
		$dateTimeZoneTaipei = new \DateTimeZone($db_params['time_zone']);
		$dateTimeTaipei = new \DateTime("now", $dateTimeZoneTaipei);
		$timeOffset = $dateTimeZoneTaipei->getOffset($dateTimeTaipei)/60;
		print_r($timeOffset);
		
$zoneName = timezone_name_from_abbr('', $timeOffset*60, 0);
echo $zoneName;

    }
	

	
	/**
     * Displays homepage.
     *
	 
	 "start_arr":{"1":"9","2":"9","3":"9","4":"9","5":"9"},
			"stop_arr":{"1":"17","2":"17","3":"17","4":"17","5":"17"},
			"weekday":"1,2,3,4,5",
	 
	 
	 
     * @return mixed
     */
    public function actionWidgetjs()
    {
       echo 'var db_params  = {
			"affiliate_link":"",
			"after_action":"",
			"allow_by_utm":0,
			"apply_by_url":0,
			"background_color_code":"f0f0f0",
			"block_by_utm":0,
			"call_algorithm":"1",
			"call_delay":0,
			"calltouch_hide_for_direct_dial_number":0,
			"calltouch_show_linger":0,
			"comments_url":"",
			"delay_extension":0,
			"dialog_instead_of_chat":"1",
			"mc_instead_of_contact_form":"0",
			"disable_mobile_widget":"0",
			"disable_night_mode":"0",
			"disable_visitor_callerid":0,
			"enable_blur":"0",
			"enable_discount":"0",
			"enable_micromenu":1,
			"ga_disable":0,
			"hide_socials":0,
			"hide_statusbar":"1",
			"income_phone_choice":1,
			"ip_deny":[],
			"language":"auto",
			"min_enter_on_active_delay":0,
			"min_popup_delay":0,
			"min_window_exit_delay":0,
			"mobile_phone_icon_pos_x":0,
			"phone_icon":"1",
			"phone_icon_always":0,
			"phone_icon_color_code":"00aff2",
			"phone_icon_color":"gray",
			"phone_icon_opacity":1,
			"phoneicon_x":90,
			"phoneicon_y":100,
			"phone_track_enable":0,
			"phone_track_postfix":"",
			"phone_track_prefix":"",
			"phone_track_whereis":"",
			"popup_after":0,
			"pulse_animation":"0",
			"restrict_by_url":0,
			"sensitivity":5,
			"show_enter":"0",
			"show_exit":"1",
			"show_hello":0,
			"show_micromenu_close":0,
			"show_office_choice":"0",
			"show_once":"1",
			"show_once_session":"0",
			"show_phone":"1",
			"show_phone_ru":"",
			"show_phone_en":"",
			"show_phone_de":"",
			"show_phone_es":"",
			"show_phone_zh":"",
			"show_phone_ms":"",
			"show_phone_pl":"",
			"show_phone_id":"",
			"show_phone_ko":"",
			"show_phone_th":"",
			"show_phone_hu":"",
			"show_phone_fr":"",
			"show_phone_ar":"",
			"show_phone_hi":"",
			"show_phone_vi":"",
			"show_phone_ja":"",
			"show_phone_pt":"",
			"show_phone_it":"",
			"show_phone_lt":"",
			"show_phone_et":"",
			"show_phone_ua":"",
			"show_phone_cs":"",
			"show_phone_ka":"",
			"show_phone_md":"",
			"show_phone_ro":"",
			"show_powered_by":1,
			"shuffle_managers_phones":0,
			"sound_chat_message":"1",
			"strict_office_choice":0,
			"success_client_sms_append":"",
			"tell_widget_site":"0",
			"text_color":"default",
			"text_to_client":"",
			"time_connection":8,
			"url_apply":"[]",
			"url_restrict":"[]",
			"utm_allowed":[],
			"utm_negate":[],
			"voice_tag":"",
			"voice_tag_replace":0,
			"widget_body_opacity":"1.0",
			"behavior_autopilot":1,
			"behavior_scrolling":7.7,
			"behavior_mouse_speed":10,
			"behavior_exit_acceleration":9,
			"behavior_mouse_vector":9.2,
			"behavior_clicking":7.9,
			"behavior_clicking_clustering":8,
			"behavior_time_site":9.3,
			"behavior_time_page":9.5,
			"behavior_forms_interaction":8.6,
			"behavior_visits":8.8,
			"behavior_views":7.2,
			"behavior_selected_views":7,
			"behavior_ads":9,
			"f_label":"",
			"avg":0,
			"show_office_list":[],
			"start_arr":{"1":"9","2":"9","4":"9"},
			"stop_arr":{"1":"9","2":"17","4":"17"},
			"weekday":"1,2,4",
			"time_zone":"UTC+03:00",
			"active":"1",
			"minutes_rest":324,
			"time_connection_nextday":57600,
			"phone_code":{"0":"+7","mask":"o (hhh) hhh-hhhh"},
			"show_phone_bg":"",
			"show_phone_lv":"",
			"stat":{"lines":2,"online":0,"total":4},
			"custom_layout":{"css_file":"iduser.css"}, 
			"has_minutes":1,
			"free_mode":0,
			"has_payments":0,
			"show_iframe":0,
			"allow_subdomain":0,
			"wp_code":"0cc2032aa1996f59015f0f6ed1a7ffc0",
			"rating":null,
			"version":"1",
			"hunter_code":"a7fb23da9005d3739f2b93c9cf05bb7a",
			"timestamp":1441186513
		}';
    }

    /**
     * Logs in a user.
     *
     * @return mixed
     */
    public function actionLogin()
    {
        if (!\Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        } else {
            return $this->render('login', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Logs out the current user.
     *
     * @return mixed
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return mixed
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            if ($model->sendEmail(Yii::$app->params['adminEmail'])) {
                Yii::$app->session->setFlash('success', 'Thank you for contacting us. We will respond to you as soon as possible.');
            } else {
                Yii::$app->session->setFlash('error', 'There was an error sending email.');
            }

            return $this->refresh();
        } else {
            return $this->render('contact', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Displays about page.
     *
     * @return mixed
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    /**
     * Signs user up.
     *
     * @return mixed
     */
    public function actionSignup()
    {
        $model = new SignupForm();
        if ($model->load(Yii::$app->request->post())) {
            if ($user = $model->signup()) {
                if (Yii::$app->getUser()->login($user)) {
                    return $this->goHome();
                }
            }
        }

        return $this->render('signup', [
            'model' => $model,
        ]);
    }

    /**
     * Requests password reset.
     *
     * @return mixed
     */
    public function actionRequestPasswordReset()
    {
        $model = new PasswordResetRequestForm();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            if ($model->sendEmail()) {
                Yii::$app->session->setFlash('success', 'Check your email for further instructions.');

                return $this->goHome();
            } else {
                Yii::$app->session->setFlash('error', 'Sorry, we are unable to reset password for email provided.');
            }
        }

        return $this->render('requestPasswordResetToken', [
            'model' => $model,
        ]);
    }

    /**
     * Resets password.
     *
     * @param string $token
     * @return mixed
     * @throws BadRequestHttpException
     */
    public function actionResetPassword($token)
    {
        try {
            $model = new ResetPasswordForm($token);
        } catch (InvalidParamException $e) {
            throw new BadRequestHttpException($e->getMessage());
        }

        if ($model->load(Yii::$app->request->post()) && $model->validate() && $model->resetPassword()) {
            Yii::$app->session->setFlash('success', 'New password was saved.');

            return $this->goHome();
        }

        return $this->render('resetPassword', [
            'model' => $model,
        ]);
    }
}
