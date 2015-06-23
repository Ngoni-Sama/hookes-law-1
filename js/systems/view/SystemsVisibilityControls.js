// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control panel for visibility of various representations in the "Systems" view.
 * This control panel is a bit similar to IntroductionVisibilityPanel, but it
 * provides 2 choices ('total' and 'components') for how the spring force is represented.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HookesLawColors = require( 'HOOKES_LAW/common/HookesLawColors' );
  var HookesLawConstants = require( 'HOOKES_LAW/common/HookesLawConstants' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var IconFactory = require( 'HOOKES_LAW/common/view/IconFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var appliedForceString = require( 'string!HOOKES_LAW/appliedForce' );
  var componentsSpring = require( 'string!HOOKES_LAW/components' );
  var displacementString = require( 'string!HOOKES_LAW/displacement' );
  var springForceString = require( 'string!HOOKES_LAW/springForce' );
  var totalString = require( 'string!HOOKES_LAW/total' );
  var valuesString = require( 'string!HOOKES_LAW/values' );

  /**
   * @param {SystemsViewProperties} properties
   * @param {Object} [options]
   * @constructor
   */
  function SystemsVisibilityControls( properties, options ) {

    options = _.extend( _.clone( HookesLawConstants.VISIBILITY_PANEL_OPTIONS ), options );

    // vector check boxes
    var appliedForceCheckBox = new CheckBox(
      IconFactory.createVectorCheckBoxContent( new Text( appliedForceString, HookesLawConstants.CONTROL_TEXT_OPTIONS ),
        { arrowFill: HookesLawColors.APPLIED_FORCE } ),
      properties.appliedForceVectorVisibleProperty,
      HookesLawConstants.CHECK_BOX_OPTIONS );
    var springForceCheckBox = new CheckBox(
      new Text( springForceString, HookesLawConstants.CONTROL_TEXT_OPTIONS ),
      properties.springForceVectorVisibleProperty,
      HookesLawConstants.CHECK_BOX_OPTIONS );
    var displacementCheckBox = new CheckBox(
      IconFactory.createVectorCheckBoxContent( new Text( displacementString, HookesLawConstants.CONTROL_TEXT_OPTIONS ), {
        arrowFill: HookesLawColors.DISPLACEMENT,
        arrowType: 'line'
      } ),
      properties.displacementVectorVisibleProperty,
      HookesLawConstants.CHECK_BOX_OPTIONS );

    // other check boxes
    var equilibriumPositionCheckBox = new CheckBox(
      IconFactory.createEquilibriumPositionCheckBoxContent(),
      properties.equilibriumPositionVisibleProperty,
      HookesLawConstants.CHECK_BOX_OPTIONS );
    var valuesCheckBox = new CheckBox(
      new Text( valuesString, HookesLawConstants.CONTROL_TEXT_OPTIONS ),
      properties.valuesVisibleProperty,
      HookesLawConstants.CHECK_BOX_OPTIONS );

    // 'total' radio button
    var totalRadioButton = new AquaRadioButton( properties.springForceRepresentationProperty, 'total',
      new HBox( {
        children: [
          new Text( totalString, HookesLawConstants.CONTROL_TEXT_OPTIONS ),
          IconFactory.createVectorIcon( { fill: HookesLawColors.SINGLE_SPRING } )
        ],
        spacing: 10
      } ),
      HookesLawConstants.RADIO_BUTTON_OPTIONS );

    // 'components' radio button
    var component1Node = IconFactory.createVectorIcon( { fill: HookesLawColors.TOP_SPRING } );
    var component2Node = IconFactory.createVectorIcon( { fill: HookesLawColors.BOTTOM_SPRING } );
    var componentsVectorIcons = new VBox( {
      children: [
        component1Node,
        component2Node
      ],
      spacing: 10
    } );
    var componentsRadioButton = new AquaRadioButton( properties.springForceRepresentationProperty, 'components',
      new HBox( {
        children: [
          new Text( componentsSpring, HookesLawConstants.CONTROL_TEXT_OPTIONS ),
          new BracketNode( {
            orientation: 'left',
            bracketLength: componentsVectorIcons.height
          } ),
          componentsVectorIcons
        ],
        spacing: 10
      } ),
      HookesLawConstants.RADIO_BUTTON_OPTIONS );

    // Change the component vector colors to match the system
    properties.seriesParallelProperty.link( function( seriesParallel ) {
      component1Node.fill = ( seriesParallel === 'series' ) ? HookesLawColors.LEFT_SPRING : HookesLawColors.TOP_SPRING;
      component2Node.fill = ( seriesParallel === 'series' ) ? HookesLawColors.RIGHT_SPRING : HookesLawColors.BOTTOM_SPRING;
    } );

    var radioButtonsBox = new VBox( {
      children: [
        totalRadioButton,
        componentsRadioButton
      ],
      align: 'left',
      spacing: 10
    } );

    var radioButtonsSubPanel = new HBox( {
      children: [ new HStrut( 25 ), radioButtonsBox ],
      spacing: 5
    } );

    // 'Values' check box pertains to vectors, so enable that check box only if one or more of the vectors is selected.
    Property.multilink(
      [ properties.appliedForceVectorVisibleProperty, properties.springForceVectorVisibleProperty, properties.displacementVectorVisibleProperty ],
      function( appliedForceVectorVisible, springForceVectorVisible, displacementVectorVisible ) {
        valuesCheckBox.enabled = ( appliedForceVectorVisible || springForceVectorVisible || displacementVectorVisible );
      } );

    // Radio buttons should be enabled only if 'spring force' is checked
    properties.springForceVectorVisibleProperty.link( function( springForceVectorVisible ) {
      totalRadioButton.enabled = componentsRadioButton.enabled = springForceVectorVisible;
    } );

    // Adjust touch areas
    var spacing = 20;
    var controls = [
      appliedForceCheckBox,
      springForceCheckBox,
      displacementCheckBox,
      equilibriumPositionCheckBox,
      valuesCheckBox,
      totalRadioButton,
      componentsRadioButton
    ];
    for ( var i = 0; i < controls.length; i++ ) {
      controls[ i ].touchArea = controls[ i ].localBounds.dilatedXY( 10, ( spacing / 2 ) - 1 );
    }

    var content = new VBox( {
      children: [
        appliedForceCheckBox,
        springForceCheckBox,
        radioButtonsSubPanel,
        displacementCheckBox,
        equilibriumPositionCheckBox,
        valuesCheckBox
      ],
      align: 'left',
      spacing: spacing
    } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, SystemsVisibilityControls );
} );