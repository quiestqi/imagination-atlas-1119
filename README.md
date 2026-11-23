# 想象的身体：看见不可见之物的姿势 · The Imagining Body: Poses of Seeing the Invisible

一个交互式研究图谱：把想象理解为“看见不可见之物”，研究它怎样落在画中人物的身体上。
28 个人物取自 ICARUS 数据集中标有 Iconclass 编码的作品（52A 理智、预见、记忆、想象；
31A25 手臂与手的姿势），并补以图像学题材，从公元前 5 世纪到 1913 年，骨架逐一人工标注。

An interactive research atlas that takes imagination to mean “seeing the invisible” and asks
how it is shown in the bodies of painted figures. 28 figures from Iconclass-coded works in the
ICARUS dataset (52A reason, foresight, memory, imagination; 31A25 postures of arms and hands),
plus iconographic subjects, from the 5th century BC to 1913; every skeleton annotated by hand.

## Sections · 页面结构

1. 姿势图版 · Pose panel — 仿瓦尔堡《记忆女神图集》的星座排列：横向时间，纵向四带（远眺、迷狂、沉潜、盲）；可拖动重排，点图看展签，可调整骨架。
2. 用身体检索 · Search with your body — 拖动木偶、上传照片或用摄像头摆姿势，按骨架相似度找出最相近的作品；预设为 Iconclass 31A25 的六类姿势。
3. 姿势散点 · Pose scatter — 肘角 × 手眼距离，颜色为四带。
4. 时间与地点 · Time and place — 世界地图上的时空立方体，可旋转、缩放、按年代播放。
5. 影响因素 · Factors — 社会、文化、技术、政治因素的谱系图，从身体检索的最相近作品开始生长，可删减分支、撤销、导出 SVG。

## Files · 文件

- `index.html` — 中文
- `en.html` — English
- `img/` — 作品图片 · images

## Run locally · 本地打开

Open `index.html` in Chrome; an internet connection is needed for fonts, d3 and the pose model.
用 Chrome 打开 `index.html`（需要联网加载字体、d3 与姿态模型）。

## Notes · 说明

- 观众姿势由浏览器内的 MoveNet（TensorFlow.js）识别，视频不会上传。 The viewer’s pose is detected in the browser; video never leaves it.
- 初步结果：28 个人物，一人标注一次；影响因素中的连接标有“有文献 / 属解释”。 Preliminary: 28 figures annotated once; factor links are marked documented or interpretive.
- 全部作品来自欧洲，反映的是资料来源（ICARUS、Iconclass）的偏差。 All works are European, reflecting the sources’ bias.
- 图片为博物馆与维基共享资源复制品的截图，来源见各作品展签。 Images are captures of museum and Wikimedia Commons reproductions; sources are linked from each label.
