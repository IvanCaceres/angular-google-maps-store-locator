var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

angular.module('uiGmapgoogle-maps.extensions').service('uiGmapExtendGWin', function() {
  return {
    init: _.once(function() {
      var uiGmapInfoBox;
      if (!(google || (typeof google !== "undefined" && google !== null ? google.maps : void 0) || (google.maps.InfoWindow != null))) {
        return;
      }
      google.maps.InfoWindow.prototype._open = google.maps.InfoWindow.prototype.open;
      google.maps.InfoWindow.prototype._close = google.maps.InfoWindow.prototype.close;
      google.maps.InfoWindow.prototype._isOpen = false;
      google.maps.InfoWindow.prototype.open = function(map, anchor, recurse) {
        if (recurse != null) {
          return;
        }
        this._isOpen = true;
        this._open(map, anchor, true);
      };
      google.maps.InfoWindow.prototype.close = function(recurse) {
        if (recurse != null) {
          return;
        }
        this._isOpen = false;
        this._close(true);
      };
      google.maps.InfoWindow.prototype.isOpen = function(val) {
        if (val == null) {
          val = void 0;
        }
        if (val == null) {
          return this._isOpen;
        } else {
          return this._isOpen = val;
        }
      };

      /*
      Do the same for InfoBox
      TODO: Clean this up so the logic is defined once, wait until develop becomes master as this will be easier
       */
      if (window.InfoBox) {
        window.InfoBox.prototype._open = window.InfoBox.prototype.open;
        window.InfoBox.prototype._close = window.InfoBox.prototype.close;
        window.InfoBox.prototype._isOpen = false;
        window.InfoBox.prototype.open = function(map, anchor) {
          this._isOpen = true;
          this._open(map, anchor);
        };
        window.InfoBox.prototype.close = function() {
          this._isOpen = false;
          this._close();
        };
        window.InfoBox.prototype.isOpen = function(val) {
          if (val == null) {
            val = void 0;
          }
          if (val == null) {
            return this._isOpen;
          } else {
            return this._isOpen = val;
          }
        };
        uiGmapInfoBox = (function(_super) {
          __extends(uiGmapInfoBox, _super);

          function uiGmapInfoBox(opts) {
            this.getOrigCloseBoxImg_ = __bind(this.getOrigCloseBoxImg_, this);
            this.getCloseBoxDiv_ = __bind(this.getCloseBoxDiv_, this);
            var box;
            box = new window.InfoBox(opts);
            _.extend(this, box);
            if (opts.closeBoxDiv != null) {
              this.closeBoxDiv_ = opts.closeBoxDiv;
            }
          }

          uiGmapInfoBox.prototype.getCloseBoxDiv_ = function() {
            return this.closeBoxDiv_;
          };

          uiGmapInfoBox.prototype.getCloseBoxImg_ = function() {
            var div, img;
            div = this.getCloseBoxDiv_();
            img = this.getOrigCloseBoxImg_();
            return div || img;
          };

          uiGmapInfoBox.prototype.getOrigCloseBoxImg_ = function() {
            var img;
            img = "";
            if (this.closeBoxURL_ !== "") {
              img = "<img";
              img += " src='" + this.closeBoxURL_ + "'";
              img += " align=right";
              img += " style='";
              img += " position: relative;";
              img += " cursor: pointer;";
              img += " margin: " + this.closeBoxMargin_ + ";";
              img += "'>";
            }
            return img;
          };

          return uiGmapInfoBox;

        })(window.InfoBox);
        window.uiGmapInfoBox = uiGmapInfoBox;
      }
      if (window.MarkerLabel_) {
        window.MarkerLabel_.prototype.setContent = function() {
          var content;
          content = this.marker_.get('labelContent');
          if (!content || _.isEqual(this.oldContent, content)) {
            return;
          }
          if (typeof (content != null ? content.nodeType : void 0) === 'undefined') {
            this.labelDiv_.innerHTML = content;
            this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
            this.oldContent = content;
          } else {
            this.labelDiv_.innerHTML = '';
            this.labelDiv_.appendChild(content);
            content = content.cloneNode(true);
            this.eventDiv_.appendChild(content);
            this.oldContent = content;
          }
        };

        /*
        Removes the DIV for the label from the DOM. It also removes all event handlers.
        This method is called automatically when the marker's <code>setMap(null)</code>
        method is called.
        @private
         */
        return window.MarkerLabel_.prototype.onRemove = function() {
          if (this.labelDiv_.parentNode != null) {
            this.labelDiv_.parentNode.removeChild(this.labelDiv_);
          }
          if (this.eventDiv_.parentNode != null) {
            this.eventDiv_.parentNode.removeChild(this.eventDiv_);
          }
          if (!this.listeners_) {
            return;
          }
          if (!this.listeners_.length) {
            return;
          }
          this.listeners_.forEach(function(l) {
            return google.maps.event.removeListener(l);
          });
        };
      }
    })
  };
});
