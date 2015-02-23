/**
 * Created by Jack Vo on 21/10/2014.
 */
(function(){
	angular.module("app.directives",["app.utils"])
		.directive("scrollableList", function(Utils){
			return {
				restrict : "A",
				scope : {
					selectedIndex : "@"
				},
				link: function(scope, element, attrs){
					var parentWrapper = element.parent(),
						viewPortHeight = 0,
						viewPortWidth = 0,
						scrollMarginRight =	( attrs['scrollMarginRight'] && attrs['scrollMarginRight'] > 0)
							? attrs['scrollMarginRight'] : 0,
						scrollMarginBottom = ( attrs['scrollMarginBottom'] && attrs['scrollMarginBottom'] > 0)
							? attrs['scrollMarginBottom'] : 0;

					scrollMarginBottom = parseInt(scrollMarginBottom);
					scrollMarginRight = parseInt(scrollMarginRight);

					if(parentWrapper){
						viewPortHeight = parentWrapper.height();
						viewPortWidth = parentWrapper.width();
					}

					var defaultPos = element.position();

					scope.$watch("selectedIndex", function(newVal, oldVal){
						if(newVal==-1) return;
						if(newVal>0){
							var children = element.children();
							if(children && children.length>0){
								var listPos = element.position(),
									selectedElement = children.eq(newVal);

								var eleWidth = selectedElement.outerWidth(),
									eleHeight = selectedElement.height(),
									elePos = selectedElement.position();

								//check if the selected element is visible in the view port
								//if not scroll the parent list to a new position that make the selected element visible
								//in the view port
								//perform scroll left or right
								var acceptableLeft = elePos.left + scrollMarginRight + eleWidth;
								if( acceptableLeft >= viewPortWidth  ){
									var newLeft = -(acceptableLeft - viewPortWidth);
									element.css({
										left: newLeft+'px'
									});
								}

								//perform scroll up or down
								var acceptableTop = elePos.top + eleHeight + scrollMarginBottom - viewPortHeight;
								var newScrollTop = 0;
								if( acceptableTop >=0){
									newScrollTop = - acceptableTop;
									element.css({
										top : newScrollTop+'px'
									});
								}else{
									if(listPos.top<0){
										element.css({
											top : 0
										});
									}
								}
							}
						}else{
							element.css({
								top: defaultPos.top,
								left: defaultPos.left
							})
						}
					});
				}
			}
		})
	;
})();