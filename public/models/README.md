# F1 Car Model

To use a real F1 car model:

1. Download a free F1 car GLB/GLTF model from:
   - https://fetchcfd.com/threeDViewGltf/4314-f1-3d-model
   - https://fetchcfd.com/threeDViewGltf/2894-formula-1-2022-car-3d-model
   - Or search for "F1 car GLB free download"

2. Rename the downloaded file to `f1-car.glb`

3. Place it in this `public/models/` folder

4. The website will automatically load and display it with animations!

## ⚡ Performance Optimization Tips

**Current model size:** ~17MB (f1-car.glb) - This is quite large and may cause slow loading.

### To optimize your model:

1. **Use GLB format** (already done) - GLB is more efficient than GLTF
2. **Reduce polygon count** - Use Blender or similar tools to decimate the mesh
3. **Compress textures** - Reduce texture resolution or use compressed formats
4. **Use Draco compression** - Compress geometry using Google's Draco algorithm
5. **Remove unnecessary data** - Remove unused materials, animations, or nodes

### Tools for optimization:
- **Blender** - Free 3D software for reducing polygon count
- **glTF-Pipeline** - Command-line tool: `npm install -g gltf-pipeline` then `gltf-pipeline -i f1-car.glb -o f1-car-optimized.glb -d`
- **Online tools** - https://glb.report/ or https://gltf.report/

**Recommended target:** Keep model files under 5MB for faster loading times.

Note: Make sure the model file is in GLB or GLTF format.
