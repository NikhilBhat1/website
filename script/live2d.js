const { Live2DModel } = PIXI.live2d;

const app = new PIXI.Application({
  view: document.getElementById('live2d-canvas'),
  transparent: true,
  autoStart: true,
  width: 300,
  height: 450,
});

Live2DModel.from('./assets/majo/魔女.model3.json').then(model => {
  app.stage.addChild(model);

  // Fit model to canvas
  model.scale.set(0.12);
  model.x = 150;
  model.y = 450;

  // Smooth tracking values
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Smooth lerp loop
  app.ticker.add(() => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    const core = model.internalModel.coreModel;

    // Eyes follow cursor
    core.setParameterValueById('ParamEyeBallX', currentX);
    core.setParameterValueById('ParamEyeBallY', -currentY);

    // Head tilts naturally
    core.setParameterValueById('ParamAngleX', currentX * 30);
    core.setParameterValueById('ParamAngleY', -currentY * 20);
    core.setParameterValueById('ParamAngleZ', currentX * -10);

    // Body follows slightly
    core.setParameterValueById('ParamBodyAngleX', currentX * 8);
  });

}).catch(err => {
  console.error('Failed to load Live2D model:', err);
});