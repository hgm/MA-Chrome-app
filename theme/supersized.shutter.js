/*

	Supersized - Fullscreen Slideshow jQuery Plugin
	Version : 3.2.6
	Theme 	: Shutter 1.1
	
	Site	: www.buildinternet.com/project/supersized
	Author	: Sam Dunn
	Company : One Mighty Roar (www.onemightyroar.com)
	License : MIT License / GPL License

*/

(function($){
	
    theme = {
	 	
	 	
        /* Initial Placement
		----------------------------*/
        _init : function(){
	 		
            // Center Slide Links
            if (api.options.slide_links) $(vars.slide_list).css('margin-left', -$(vars.slide_list).width()/2);
	 		
            // Start progressbar if autoplay enabled
            if (api.options.autoplay){
                if (api.options.progress_bar) theme.progressBar();
            }else{
                if ($(vars.play_button).attr('src')) $(vars.play_button).attr("src", vars.image_path + "play.png");	// If pause play button is image, swap src
                if (api.options.progress_bar) $(vars.progress_bar).stop().animate({
                    left : -$(window).width()
                    }, 0 );	//  Place progress bar
            }
			
			
            /* Thumbnail Tray
			----------------------------*/
            // Hide tray off screen
            $(vars.thumb_tray).animate({
                top : -$(vars.thumb_tray).height()
                }, 0 );
			
            // Thumbnail Tray Toggle
            $(vars.thumb_tray_button).toggle(function(){
                $(vars.thumb_tray).stop().animate({
                    top : 0, 
                    avoidTransforms : true
                }, 300 );
                $(vars.thumb_tray_button).removeClass('closed').addClass('opened');
                if ($(vars.tray_arrow).attr('src')) $(vars.tray_arrow).attr("src", vars.image_path + "button-tray-up.png");
                return false;
            }, function() {
                $(vars.thumb_tray).stop().animate({
                    top : -$(vars.thumb_tray).height(), 
                    avoidTransforms : true
                }, 300 );
                $(vars.thumb_tray_button).removeClass('opened').addClass('closed');
                if ($(vars.tray_arrow).attr('src')) $(vars.tray_arrow).attr("src", vars.image_path + "button-tray-down.png");
                return false;
            });
			
            // Make thumb tray proper size
            $(vars.thumb_list).width($('> li', vars.thumb_list).length * $('> li', vars.thumb_list).outerWidth(true));	//Adjust to true width of thumb markers
			
            // Slide info Toggle
            $(vars.info_tray_button).toggle(function(e){
                $(vars.info_tray).stop().animate({
                    bottom : 0, 
                    avoidTransforms : true
                }, 300 );
                $(vars.info_tray_button).removeClass('closed').addClass('opened');
                e.preventDefault();
            }, function(e) {
                $(vars.info_tray).stop().animate({
                    //bottom : -$(vars.info_tray).height()+50, 
                    bottom : -$(vars.info_tray).height()+$(vars.slide_caption).height()-10,
                    avoidTransforms : true
                }, 300 );
                $(vars.info_tray_button).removeClass('opened').addClass('closed');
                e.preventDefault();
            });
            
            // Display total slides
            if ($(vars.slide_total).length){
                $(vars.slide_total).html(api.options.slides.length);
            }
			
			
            /* Thumbnail Tray Navigation
			----------------------------*/	
            if (api.options.thumb_links){
                //Hide thumb arrows if not needed
                if ($(vars.thumb_list).width() <= $(vars.thumb_tray).width()){
                    $(vars.thumb_back +','+vars.thumb_forward).fadeOut(0);
                }
				
                // Thumb Intervals
                vars.thumb_interval = Math.floor($(vars.thumb_tray).width() / $('> li', vars.thumb_list).outerWidth(true)) * $('> li', vars.thumb_list).outerWidth(true);
                vars.thumb_page = 0;
        		
                // Cycle thumbs forward
                $(vars.thumb_forward).click(function(){
                    if (vars.thumb_page - vars.thumb_interval <= -$(vars.thumb_list).width()){
                        vars.thumb_page = 0;
                        $(vars.thumb_list).stop().animate({
                            'left': vars.thumb_page
                            }, {
                            duration:500, 
                            easing:'easeOutExpo'
                        });
                    }else{
                        vars.thumb_page = vars.thumb_page - vars.thumb_interval;
                        $(vars.thumb_list).stop().animate({
                            'left': vars.thumb_page
                            }, {
                            duration:500, 
                            easing:'easeOutExpo'
                        });
                    }
                });
        		
                // Cycle thumbs backwards
                $(vars.thumb_back).click(function(){
                    if (vars.thumb_page + vars.thumb_interval > 0){
                        vars.thumb_page = Math.floor($(vars.thumb_list).width() / vars.thumb_interval) * -vars.thumb_interval;
                        if ($(vars.thumb_list).width() <= -vars.thumb_page) vars.thumb_page = vars.thumb_page + vars.thumb_interval;
                        $(vars.thumb_list).stop().animate({
                            'left': vars.thumb_page
                            }, {
                            duration:500, 
                            easing:'easeOutExpo'
                        });
                    }else{
                        vars.thumb_page = vars.thumb_page + vars.thumb_interval;
                        $(vars.thumb_list).stop().animate({
                            'left': vars.thumb_page
                            }, {
                            duration:500, 
                            easing:'easeOutExpo'
                        });
                    }
                });
				
            }
			
			
            /* Navigation Items
			----------------------------*/
            $(vars.next_slide).click(function() {
                api.nextSlide();
            });
		    
            $(vars.prev_slide).click(function() {
                api.prevSlide();
            });
		    
            // Full Opacity on Hover
            if(jQuery.support.opacity){
                $(vars.prev_slide +','+vars.next_slide).mouseover(function() {
                    $(this).stop().animate({
                        opacity:0.9
                    },100);
                }).mouseout(function(){
                    $(this).stop().animate({
                        opacity:0.4
                    },100);
                });
            }
			
            if (api.options.thumbnail_navigation){
                // Next thumbnail clicked
                $(vars.next_thumb).click(function() {
                    api.nextSlide();
                });
                // Previous thumbnail clicked
                $(vars.prev_thumb).click(function() {
                    api.prevSlide();
                });
            }
			
            $(vars.play_button).click(function() {
                api.playToggle();						    
            });
			
			
            /* Thumbnail Mouse Scrub
			----------------------------*/
            if (api.options.mouse_scrub){
                $(vars.thumb_tray).mousemove(function(e) {
                    var containerWidth = $(vars.thumb_tray).width(),
                    listWidth = $(vars.thumb_list).width();
                    if (listWidth > containerWidth){
                        var mousePos = 1,
                        diff = e.pageX - mousePos;
                        if (diff > 10 || diff < -10) { 
                            mousePos = e.pageX; 
                            newX = (containerWidth - listWidth) * (e.pageX/containerWidth);
                            diff = parseInt(Math.abs(parseInt($(vars.thumb_list).css('left'))-newX )).toFixed(0);
                            $(vars.thumb_list).stop().animate({
                                'left':newX
                            }, {
                                duration:diff*3, 
                                easing:'easeOutExpo'
                            });
                        }
                    }
                });
            }
			
			
            /* Window Resize
			----------------------------*/
            $(window).resize(function(){
				
                // Delay progress bar on resize
                if (api.options.progress_bar && !vars.in_animation){
                    if (vars.slideshow_interval) clearInterval(vars.slideshow_interval);
                    if (api.options.slides.length - 1 > 0) clearInterval(vars.slideshow_interval);
					
                    $(vars.progress_bar).stop().animate({
                        left : -$(window).width()
                        }, 0 );
					
                    if (!vars.progressDelay && api.options.slideshow){
                        // Delay slideshow from resuming so Chrome can refocus images
                        vars.progressDelay = setTimeout(function() {
                            if (!vars.is_paused){
                                theme.progressBar();
                                vars.slideshow_interval = setInterval(api.nextSlide, api.options.slide_interval);
                            }
                            vars.progressDelay = false;
                        }, 1000);
                    }
                }
				
                // Thumb Links
                if (api.options.thumb_links && vars.thumb_tray.length){
                    // Update Thumb Interval & Page
                    vars.thumb_page = 0;	
                    vars.thumb_interval = Math.floor($(vars.thumb_tray).width() / $('> li', vars.thumb_list).outerWidth(true)) * $('> li', vars.thumb_list).outerWidth(true);
					
                    // Adjust thumbnail markers
                    if ($(vars.thumb_list).width() > $(vars.thumb_tray).width()){
                        $(vars.thumb_back +','+vars.thumb_forward).fadeIn('fast');
                        $(vars.thumb_list).stop().animate({
                            'left':0
                        }, 200);
                    }else{
                        $(vars.thumb_back +','+vars.thumb_forward).fadeOut('fast');
                    }
					
                }
            });	
		
            //Hide loading animation
            if (vars.init_loader){
                $(vars.init_loader).fadeOut('slow', function(){
                    $(vars.init_loader).remove();
                });
            }
        },
	 	
	 	
        /* Go To Slide
		----------------------------*/
        goTo : function(){
            if (api.options.progress_bar && !vars.is_paused){
                $(vars.progress_bar).stop().animate({
                    left : -$(window).width()
                    }, 0 );
                theme.progressBar();
            }
        },
	 	
        /* Play & Pause Toggle
		----------------------------*/
        playToggle : function(state){
	 		
            if (state =='play'){
                // If image, swap to pause
                if ($(vars.play_button).attr('src')) $(vars.play_button).attr("src", vars.image_path + "pause.png");
                $(vars.play_button).removeClass('play').addClass('pause');
                if (api.options.progress_bar && !vars.is_paused) theme.progressBar();
            }else if (state == 'pause'){
                // If image, swap to play
                if ($(vars.play_button).attr('src')) $(vars.play_button).attr("src", vars.image_path + "play.png");
                $(vars.play_button).removeClass('pause').addClass('play');
                if (api.options.progress_bar && vars.is_paused)$(vars.progress_bar).stop().animate({
                    left : -$(window).width()
                    }, 0 );
            }
	 		
        },
	 	
	 	
        /* Before Slide Transition
		----------------------------*/
        beforeAnimation : function(direction){
            if (api.options.progress_bar && !vars.is_paused) $(vars.progress_bar).stop().animate({
                left : -$(window).width()
                }, 0 );
		  	
            /* Update Fields
		  	----------------------------*/
            // Update slide caption
            if ($(vars.slide_caption).length){
                (api.getField('title')) ? $(vars.slide_caption).html(api.getField('title')) : $(vars.slide_caption).html('');
            }
            // Update slide description
            if ($(vars.slide_desc).length){
                if (api.getField('desc')){
                    $(vars.slide_desc).html(api.getField('desc'));
                } else {
                    $(vars.slide_desc).html('');
                }
            }
            // Update slide 'read more' URL
            if ($(vars.slide_link).length){
                if (api.getField('url')){
                    $(vars.slide_link).attr('href', api.getField('url')).removeClass('nodisplay');
                } else {
                    $(vars.slide_link).attr('href', '').addClass('nodisplay');
                }
            }
            // Update slide date
            if ($(vars.slide_date).length){
                if (api.getField('date')){
                    $(vars.slide_date).html(theme.getDateString(api.getField('date')));
                }
                else {
                    $(vars.slide_date).html('');
                }
            }
            // Update slide number
            if (vars.slide_current.length){
                $(vars.slide_current).html(vars.current_slide + 1);
            }
            
		    
            // Highlight current thumbnail and adjust row position
            if (api.options.thumb_links){
		    
                $('.current-thumb').removeClass('current-thumb');
                $('li', vars.thumb_list).eq(vars.current_slide).addClass('current-thumb');
				
                // If thumb out of view
                if ($(vars.thumb_list).width() > $(vars.thumb_tray).width()){
                    // If next slide direction
                    if (direction == 'next'){
                        if (vars.current_slide == 0){
                            vars.thumb_page = 0;
                            $(vars.thumb_list).stop().animate({
                                'left': vars.thumb_page
                                }, {
                                duration:500, 
                                easing:'easeOutExpo'
                            });
                        } else if ($('.current-thumb').offset().left - $(vars.thumb_tray).offset().left >= vars.thumb_interval){
                            vars.thumb_page = vars.thumb_page - vars.thumb_interval;
                            $(vars.thumb_list).stop().animate({
                                'left': vars.thumb_page
                                }, {
                                duration:500, 
                                easing:'easeOutExpo'
                            });
                        }
                    // If previous slide direction
                    }else if(direction == 'prev'){
                        if (vars.current_slide == api.options.slides.length - 1){
                            vars.thumb_page = Math.floor($(vars.thumb_list).width() / vars.thumb_interval) * -vars.thumb_interval;
                            if ($(vars.thumb_list).width() <= -vars.thumb_page) vars.thumb_page = vars.thumb_page + vars.thumb_interval;
                            $(vars.thumb_list).stop().animate({
                                'left': vars.thumb_page
                                }, {
                                duration:500, 
                                easing:'easeOutExpo'
                            });
                        } else if ($('.current-thumb').offset().left - $(vars.thumb_tray).offset().left < 0){
                            if (vars.thumb_page + vars.thumb_interval > 0) return false;
                            vars.thumb_page = vars.thumb_page + vars.thumb_interval;
                            $(vars.thumb_list).stop().animate({
                                'left': vars.thumb_page
                                }, {
                                duration:500, 
                                easing:'easeOutExpo'
                            });
                        }
                    }
                }
            }
              
            //adjust info box location
            if ($(vars.info_tray_button).hasClass('closed')){
                $(vars.info_tray).stop().animate({
                    bottom : -$(vars.info_tray).height()+$(vars.slide_caption).height()-10,
                    avoidTransforms : true
                }, 300 );
//                $(vars.info_tray).css(
//                    'bottom',
//                    -$(vars.info_tray).height()+$(vars.slide_caption).height()-10
//                );
            } 
        },
	 	
	 	
        /* After Slide Transition
		----------------------------*/
        afterAnimation : function(){
            if (api.options.progress_bar && !vars.is_paused) theme.progressBar();	//  Start progress bar
        },
	 	
	 	
        /* Progress Bar
		----------------------------*/
        progressBar : function(){
            $(vars.progress_bar).stop().animate({
                left : -$(window).width()
                }, 0 ).animate({
                left:0
            }, api.options.slide_interval);
        },
	 	
        /* format a time-stamp into a nice string:
         * just now / 1 hour ago / 23 hours ago / 3 days ago / date
         */
	getDateString : function(ts){
            var time = new Date(),
            delta = Math.floor((time.getTime()/1000-ts)/60); //time since publish in minutes
            if (delta < 5){
                return 'just now';
            } else if (delta < 60){
                return delta +' minutes ago';
            } else if(delta < 90){
                return '1 hour ago';
            } else if(delta < 2880){ //60*24*2 = 48 hours
                return Math.floor(delta/60) +' hours ago';
            } else if (delta < 8640){ //60*24*6 = 6 days
                return Math.floor(delta/1440)+' days ago';
            } else {
                time = new Date(ts * 1000);
                return time.toDateString();
            }
        }
    };
	 
	 
    /* Theme Specific Variables
	 ----------------------------*/
    $.supersized.themeVars = {
	 	
        // Internal Variables
        progress_delay		:	false,				// Delay after resize before resuming slideshow
        thumb_page 			: 	false,                  // Thumbnail page
        thumb_interval 		: 	false,				// Thumbnail interval
        image_path			:	'img/',                 // Default image path
													
        // General Elements
        init_loader                     :       '#init-loader',         // initial loader overlay (splash screen)
        play_button			:	'#pauseplay',		// Play/Pause button
        next_slide			:	'#nextslide',		// Next slide button
        prev_slide			:	'#prevslide',		// Prev slide button
        next_thumb			:	'#nextthumb',		// Next slide thumb button
        prev_thumb			:	'#prevthumb',		// Prev slide thumb button
		
        info_tray		:	'#slide-info-wrapper',	// Slide info container
        info_tray_button        :       '#info-tray-button',    // Slide info tray button
        slide_caption		:	'#slidecaption',	// Slide caption
        slide_desc		    :	'#slidedesc',// Slide description
        slide_date		    :	'#slidedate',// Slide date
        slide_current		:	'.slidenumber',		// Current slide number
        slide_total			:	'.totalslides',		// Total Slides
        slide_link                      :       '#readmore',            //read-more link
        slide_list			:	'#slide-list',		// Slide jump list							
		
        thumb_tray			:	'#thumb-tray',		// Thumbnail tray
        thumb_list			:	'#thumb-list',		// Thumbnail list
        thumb_forward		:	'#thumb-forward',	// Cycles forward through thumbnail list
        thumb_back			:	'#thumb-back',		// Cycles backwards through thumbnail list
        tray_arrow			:	'#tray-arrow',		// Thumbnail tray button arrow
        thumb_tray_button			:	'#tray-button',		// Thumbnail tray button
		
        progress_bar		:	'#progress-bar'		// Progress bar
	 												
    };												
	
    /* Theme Specific Options
	 ----------------------------*/												
    $.supersized.themeOptions = {					
	 						   
        progress_bar		:	1,		// Timer for each slide											
        mouse_scrub			:	0		// Thumbnails move with mouse
		
    };
	
	
})(jQuery);
