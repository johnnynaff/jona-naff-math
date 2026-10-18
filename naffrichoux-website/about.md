---
title: About
kicker: Biography
permalink: /about/
body_class: about
description: PhD candidate in mathematics working at the interface of stochastic analysis and numerical analysis.
---

I am a PhD candidate in mathematics at the [Laboratoire de Mathématiques et de leurs Applications de Pau](https://lma-umr5142.univ-pau.fr) (LMAP, UMR CNRS 5142), part of the Université de Pau et des Pays de l'Adour. My thesis is supervised by **Charles-Edouard Bréhier** (LMAP) and **Ludovic Goudenège** (LaMME, Université d'Évry Paris-Saclay).

My work sits at the meeting point of stochastic analysis and numerical analysis. I study stochastic differential equations and parabolic stochastic partial differential equations whose coefficients are irregular — sometimes so irregular that the equation without noise is ill-posed — and ask two kinds of questions: *when* do these equations have a unique, stable solution, and *how accurately* can that solution be approximated by a numerical scheme, including over long time horizons?

Alongside research, I teach undergraduate mathematics at UPPA — see [Teaching]({{ '/teaching/' | relative_url }}).

<!-- Add a paragraph about your background here (previous studies, what drew you to SPDEs, etc.). -->

<div class="card card--spaced">
  <dl class="facts">
    <dt>Position</dt>
    <dd>{{ site.author.position }}</dd>
    <dt>Laboratory</dt>
    <dd><a href="{{ site.lab.url }}">{{ site.lab.name }}</a> ({{ site.lab.umr }})</dd>
    <dt>University</dt>
    <dd><a href="{{ site.university.url }}">{{ site.university.name }}</a></dd>
    <dt>Supervisors</dt>
    <dd>{% for s in site.supervisors %}{{ s.name }} <span class="muted">({{ s.affiliation }})</span>{% unless forloop.last %}<br>{% endunless %}{% endfor %}</dd>
    <dt>Research area</dt>
    <dd>{{ site.author.field }}</dd>
  </dl>
</div>

<h2 class="section-title">Education</h2>

<ol class="timeline">
  {% for e in site.data.education %}
  <li class="timeline__item">
    <span class="timeline__period">{{ e.period }}</span>
    <div>
      <p class="timeline__title">{{ e.title }}</p>
      <p class="timeline__place">{{ e.place }}</p>
      {% if e.detail %}<div class="timeline__detail">{{ e.detail | markdownify }}</div>{% endif %}
    </div>
  </li>
  {% endfor %}
</ol>

{% if site.author.cv != "" and site.author.cv %}
<p class="cv-row">
  <a class="button button--primary" href="{{ site.author.cv | relative_url }}">Download CV (PDF)</a>
</p>
{% endif %}
