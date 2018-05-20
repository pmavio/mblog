import Vue from 'vue';
// v-drag: 弹窗拖拽
Vue.directive('drag', {
    bind : function(el, binding, vnode) {
        var dlg = el.getElementsByClassName("el-dialog")[0];
        var title = el.getElementsByClassName("el-dialog__title")[0];
        title.style.userSelect="none";
        title.style["-ms-user-select"] = "none";
        title.style["-moz-user-select"] = "none";
        title.style.cursor="move";
       
        dlg.offsetX = 0;
        dlg.offsetY = 0;
        
        var move = function(e){
            dlg.style.marginLeft = '0px';
            dlg.style.marginTop = '0px';
            dlg.style.left = (e.pageX - dlg.offsetX) + 'px';
            dlg.style.top = (e.pageY - dlg.offsetY) + 'px';
        }
         
        var up = function() {
            removeEventListener('mousemove', move);
            removeEventListener('mouseup', up);
        }
        var down = function(e){
            dlg.offsetX = (e.pageX - dlg.offsetLeft);
            dlg.offsetY = (e.pageY - dlg.offsetTop );

            addEventListener('mousemove', move);
            addEventListener('mouseup', up);
        }
        var header = el.getElementsByClassName("el-dialog__header")[0];
        header.style.cursor="move"
        header.addEventListener('mousedown', down);
}
});

// v-dialogDragWidth: 弹窗宽度改变
Vue.directive('dialogDragWidth', {

    bind:function(el, binding, vnode, oldVnode) {
        const dragDom = binding.value.$el.querySelector('.el-dialog');
        // const dragDom = el.getElementsByClassName("el-dialog")[0];
        el.onmousedown = (e) => {
            
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;
            
            document.onmousemove = function (e) {
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离 
                const l = e.clientX - disX;
                dragDom.style.width = `${l}px`;
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }  
    }
})
