window.addEventListener('load', () => {
  const Live2DModel = window.PIXI.live2d.Live2DModel;
  const app = new PIXI.Application({
    view: document.getElementById('live2d-canvas'),
    transparent: true,
    autoStart: true,
    width: 400,
    height: 600,
    backgroundAlpha: 0,
  });

  Live2DModel.from('./assets/Sparkle/Sparkle.model3.json').then(model => {
    app.stage.addChild(model);

    model.scale.set(0.07);
    model.x = 120;
    model.y = 300;

    // Disable motion manager
    model.internalModel.motionManager.update = () => false;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    app.ticker.add(() => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const core = model.internalModel.coreModel;

      core.setParameterValueById('Param169', currentX * 30);
      core.setParameterValueById('Param252', -currentY * 30);
      core.setParameterValueById('Param253', currentX * -10);
      core.setParameterValueById('ParamBodyAngleX2', currentX * 10);
      core.setParameterValueById('ParamBodyAngleY2', -currentY * 10);
      core.setParameterValueById('ParamBodyAngleZ2', currentX * -5);

      // Increased eye movement range
      core.setParameterValueById('ParamEyeBallX', currentX * 3);
      core.setParameterValueById('ParamEyeBallY', -currentY * 3);

      core.setParameterValueById('ParamEyeLOpen', 1);
      core.setParameterValueById('ParamEyeROpen', 1);
      core.setParameterValueById('ParamBreath', Math.sin(Date.now() / 1000) * 0.5 + 0.5);
    });

  }).catch(err => {
    console.error('Failed to load Live2D model:', err);
  });
});