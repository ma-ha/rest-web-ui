# CSS and Themes

There are some basic methods you should know:

1. Dimensions layout of the views must be set in the structure 
   files for each layout and view (i.e. not done via CSS files):
   * `layout.page_width` in `px` or `%` (e.g. `"height":"1000px"` 
      or `"height":"95%"`)
   * `layout.rows.height` in `px` (e.g. `"height":"600px"`)
   * `layout.rows.cols.width` in `px` or `%`
   * `layout.rows.cols.rows.height` in `px`
   * ... and so on
2. Every single view can have a `"decor"` setting, 
   to define a frame (divs with background images) and 
   also different CSS classes.
   There are currently three decors build in:
   * If no decor or theme is defined at all, just DIVs are arranged
   * `"decor":"decor"` with rounded white and gray borders 
   * `"decor":"tedge"` rounded half transparent borders
3. CSS files:
   * Predefined CSS files are loaded first.
   * If you define a `"theme":"themename"` on the layout level of 
     the page, the page will try to load `css-custom/<themename>.css`. 
   * The last CSS file is the `css-custom/custom.css`. 
     You can place all your modifications here. 
    

# Mobile Phone and Tablet Support   
The framework tries to detect mobile phones or tablets. 

If the framework detects a mobile phone:

1. The page will try use the layout structure `<name>-m/structure` 
2. The page will try to load `css-custom/custom-m.css` 
    
If the framework detects a tablet device:

1. The page will try use the layout structure `<name>-t/structure` 
2. The page will try to load `css-custom/custom-t.css` 
