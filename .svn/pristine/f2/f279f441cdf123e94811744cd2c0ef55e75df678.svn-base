document.addEventListener('DOMContentLoaded', function () {
    /* gnb */
    $('.gnb_item').mouseover(function () {
        $(this).addClass('on');
    });
    $('.gnb_item').mouseout(function () {
        $(this).removeClass('on');
    });
    /* gnb end */
    
    /* top btn */
    $('.top_wrap .btn').mouseover(function () {
        $(this).addClass('on');
    });
    $('.top_wrap .btn').mouseout(function () {
        $(this).removeClass('on');
    });
    /* top btn end */

    /* simulator 선택 */
    $('.simulator_item a').on('click', function () {
        $('.simulator_item').removeClass('active');
        $(this).closest('.simulator_item').addClass('active');
    });
    /* simulator 선택 end */
    
    /* simulator_sub_list */
    $('.simulator_item_gnb>a').click(function () {
        if($(this).next('.simulator_sub_list').is(':visible') == true) {
            $(this).closest('.simulator_item_gnb').removeClass('on');
        } else {
            $(this).closest('.simulator_item_gnb').addClass('on');
        }
    });
    /* simulator_sub_list end */
    
});
