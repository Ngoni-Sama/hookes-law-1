// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control panel for changing applied force.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HookesLawColors = require( 'HOOKES_LAW/common/HookesLawColors' );
  var HookesLawFont = require( 'HOOKES_LAW/common/HookesLawFont' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var ValueDisplay = require( 'HOOKES_LAW/common/view/ValueDisplay' );

  // strings
  var appliedForceColonString = require( 'string!HOOKES_LAW/appliedForceColon' );
  var pattern_0value_1units = require( 'string!HOOKES_LAW/pattern.0value.1units' );
  var unitsNewtons = require( 'string!HOOKES_LAW/units.newtons' );

  // constants
  var ARROW_BUTTON_OPTIONS = { /* TODO */ };
  var ARROW_BUTTON_DELTA = 1;
  var MAJOR_TICK_LABEL_OPTIONS = { font: new HookesLawFont( 16 ) };
  var MINOR_TICK_SPACING = 10;

  /**
   * @param {Property.<number>} appliedForceProperty units = N
   * @param {Range} appliedForceRange
   * @param {Object} [options]
   * @constructor
   */
  function AppliedForcePanel( appliedForceProperty, appliedForceRange, options ) {

    options = _.extend( {
      title: appliedForceColonString,
      fill: HookesLawColors.CONTROL_PANEL_FILL,
      xMargin: 15,
      yMargin: 15,
      resize: false,
      decimalPlaces: 0
    }, options );

    this.titleNode = new Text( options.title, { font: new HookesLawFont( 20 ) } ); // @private

    var leftArrowButton = new ArrowButton( 'left', function() {
      appliedForceProperty.set( Math.max( appliedForceProperty.get() - ARROW_BUTTON_DELTA, appliedForceRange.min ) );
    }, ARROW_BUTTON_OPTIONS );

    var rightArrowButton = new ArrowButton( 'right', function() {
      appliedForceProperty.set( Math.min( appliedForceProperty.get() + ARROW_BUTTON_DELTA, appliedForceRange.max ) );
    }, ARROW_BUTTON_OPTIONS );

    var valueDisplay = new ValueDisplay( appliedForceProperty, appliedForceRange, unitsNewtons, pattern_0value_1units );

    var slider = new HSlider( appliedForceProperty, appliedForceRange, {
      trackSize: new Dimension2( 175, 5 ),
      thumbFillEnabled: PhetColorScheme.RED_COLORBLIND,
      thumbFillHighlighted: PhetColorScheme.RED_COLORBLIND.brighterColor()
    } );
    slider.addMajorTick( appliedForceRange.min, new Text( Util.toFixed( appliedForceRange.min, options.decimalPlaces ), MAJOR_TICK_LABEL_OPTIONS ) );
    slider.addMajorTick( 0, new Text( Util.toFixed( 0, 0 ), MAJOR_TICK_LABEL_OPTIONS ) );
    slider.addMajorTick( appliedForceRange.max, new Text( Util.toFixed( appliedForceRange.max, options.decimalPlaces ), MAJOR_TICK_LABEL_OPTIONS ) );
    for ( var i = appliedForceRange.min; i < appliedForceRange.max; ) {
      slider.addMinorTick( i );
      i += MINOR_TICK_SPACING;
    }

    var content = new HBox( {
      children: [
        this.titleNode,
        valueDisplay,
        leftArrowButton,
        slider,
        rightArrowButton
      ],
      spacing: 15,
      resize: false
    } );

    Panel.call( this, content, options );

    appliedForceProperty.link( function( appliedForce ) {
      leftArrowButton.enabled = ( appliedForce > appliedForceRange.min );
      rightArrowButton.enabled = ( appliedForce < appliedForceRange.max );
    } );
  }

  return inherit( Panel, AppliedForcePanel, {

    setTitle: function( title ) {
      this.titleNode.text = title;
    },
    set title( value ) { this.setTitle( value ); },

    getTitle: function() {
      return this.titleNode.text;
    },
    get title() { return this.getTitle(); }
  } );
} );