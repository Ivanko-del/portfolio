/* Shared behaviour for the Ukrainian (/) and English (/en/) pages.
   All user-facing copy lives in STRINGS and is picked by <html lang>. */
(function () {
  'use strict';

  var STRINGS = {
    uk: {
      locale: 'uk-UA',
      siteLink: 'сайт ↗',
      reviewsEmpty: 'Поки що відгуків немає — будь першим!',
      reviewsFailed: 'Не вдалось завантажити відгуки. Спробуйте оновити сторінку.',
      reviewThanks: 'Дякуємо за відгук!',
      reviewIncomplete: 'Заповніть нікнейм, оцінку і текст відгуку.',
      reviewFailed: 'Не вдалось надіслати відгук. Спробуйте ще раз.',
      rateLimited: 'Забагато заявок з цієї IP-адреси. Спробуйте пізніше або напишіть напряму в Telegram.',
      sendFailed: 'Не вдалось надіслати заявку. Напишіть напряму в Telegram.',
      refundIncomplete: "Заповніть ім'я, контакт і причину повернення.",
      refundSent: "Заявку надіслано. Зв'яжусь з вами найближчим часом.",
      orderIncomplete: "Вкажіть ім'я і Telegram — це обов'язкові поля.",
      orderSent: "Заявку надіслано. Зв'яжусь з вами найближчим часом!",
      tgName: function (name) { return 'Мене звати ' + name + '.'; },
      tgSite: function (site) { return 'Сайт/бізнес: ' + site + '.'; },
      tgIntent: 'Хочу замовити сайт.'
    },
    en: {
      locale: 'en-US',
      siteLink: 'website ↗',
      reviewsEmpty: 'No reviews yet — be the first one!',
      reviewsFailed: 'Could not load the reviews. Please refresh the page.',
      reviewThanks: 'Thanks for your review!',
      reviewIncomplete: 'Please fill in a nickname, a rating and the review text.',
      reviewFailed: 'Could not submit the review. Please try again.',
      rateLimited: 'Too many requests from this IP address. Please try later, or message me directly on Telegram.',
      sendFailed: 'Could not send the request. Please message me directly on Telegram.',
      refundIncomplete: 'Please fill in your name, contact and the reason for the refund.',
      refundSent: 'Request sent. I will get back to you shortly.',
      orderIncomplete: 'Name and Telegram are required fields.',
      orderSent: 'Request sent. I will get back to you shortly!',
      tgName: function (name) { return 'My name is ' + name + '.'; },
      tgSite: function (site) { return 'Business/site: ' + site + '.'; },
      tgIntent: 'I would like to order a website.'
    }
  };

  var T = STRINGS[document.documentElement.lang === 'en' ? 'en' : 'uk'];

  /* ---------- scroll reveal ---------- */
  (function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- 3D tilt ---------- */
  window.canTilt3D = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.applyTilt = function (el, maxTilt) {
    if (!window.canTilt3D || !el || el.__tiltBound) return;
    el.__tiltBound = true;
    maxTilt = maxTilt || 7;
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var nx = x / rect.width - 0.5;
      var ny = y / rect.height - 0.5;
      el.style.setProperty('--ry', (nx * maxTilt * 2).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-ny * maxTilt * 2).toFixed(2) + 'deg');
      el.style.setProperty('--mx', (x / rect.width * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (y / rect.height * 100).toFixed(1) + '%');
    });
    el.addEventListener('mouseleave', function () {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  };

  (function () {
    var tiltEls = document.querySelectorAll('.project, .pricing-card, .why-card, .review-card, .faq-item');
    tiltEls.forEach(function (el) { window.applyTilt(el, 7); });
  })();

  (function () {
    var stage = document.querySelector('.cube-stage');
    if (!stage || !window.canTilt3D) return;
    document.addEventListener('mousemove', function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      stage.style.transform = 'rotateY(' + (nx * 26).toFixed(2) + 'deg) rotateX(' + (-ny * 26).toFixed(2) + 'deg)';
    });
  })();

  /* ---------- scroll progress bar ---------- */
  (function () {
    var bar = document.getElementById('scrollBar');
    if (!bar) return;
    function updateBar() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar);
    updateBar();
  })();

  /* ---------- hero counters ---------- */
  (function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var start = null;
      var duration = 900;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 400);
    });
  })();

  /* ---------- active nav link ---------- */
  (function () {
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!navLinks.length || !('IntersectionObserver' in window)) return;
    var sections = [];
    navLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) sections.push({ link: link, section: section });
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (item) {
          item.link.classList.toggle('is-active', item.section === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (item) { observer.observe(item.section); });
  })();

  /* ---------- refund request form ---------- */
  (function () {
    var form = document.getElementById('refundForm');
    if (!form) return;
    var msgEl = document.getElementById('refundFormMsg');
    var submitBtn = document.getElementById('rfSubmit');
    var ENDPOINT = 'https://ywzgrdvupvmjonbxzavq.supabase.co/functions/v1/refund-request';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msgEl.textContent = '';
      msgEl.className = 'review-form-msg';

      var honeypot = form.querySelector('#rfWebsite').value;
      var name = form.querySelector('#rfName').value.trim();
      var contact = form.querySelector('#rfContact').value.trim();
      var orderInfo = form.querySelector('#rfOrder').value.trim();
      var amount = form.querySelector('#rfAmount').value.trim();
      var reason = form.querySelector('#rfReason').value.trim();

      if (!honeypot && (!name || !contact || !reason)) {
        msgEl.textContent = T.refundIncomplete;
        msgEl.className = 'review-form-msg is-error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.style.opacity = '.6';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, contact: contact, order_info: orderInfo,
          amount: amount, reason: reason, website: honeypot
        })
      }).then(function (res) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        if (res.status === 429) {
          msgEl.textContent = T.rateLimited;
          msgEl.className = 'review-form-msg is-error';
          return;
        }
        if (!res.ok) throw new Error('bad_response');
        form.reset();
        msgEl.textContent = T.refundSent;
        msgEl.className = 'review-form-msg is-success';
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        msgEl.textContent = T.sendFailed;
        msgEl.className = 'review-form-msg is-error';
      });
    });
  })();

  /* ---------- order request form ---------- */
  (function () {
    var form = document.getElementById('orderForm');
    if (!form) return;
    var msgEl = document.getElementById('orderFormMsg');
    var submitBtn = document.getElementById('ordSubmit');
    var ENDPOINT = 'https://ywzgrdvupvmjonbxzavq.supabase.co/functions/v1/order-request';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msgEl.textContent = '';
      msgEl.className = 'review-form-msg';

      var honeypot = form.querySelector('#ordWebsite').value;
      var name = form.querySelector('#ordName').value.trim();
      var siteInfo = form.querySelector('#ordSite').value.trim();
      var telegram = form.querySelector('#ordTg').value.trim();
      var phone = form.querySelector('#ordPhone').value.trim();

      if (!honeypot && (!name || !telegram)) {
        msgEl.textContent = T.orderIncomplete;
        msgEl.className = 'review-form-msg is-error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.style.opacity = '.6';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, site_info: siteInfo, telegram: telegram,
          phone: phone, website: honeypot
        })
      }).then(function (res) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        if (res.status === 429) {
          msgEl.textContent = T.rateLimited;
          msgEl.className = 'review-form-msg is-error';
          return;
        }
        if (!res.ok) throw new Error('bad_response');
        form.reset();
        msgEl.textContent = T.orderSent;
        msgEl.className = 'review-form-msg is-success';
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        msgEl.textContent = T.sendFailed;
        msgEl.className = 'review-form-msg is-error';
      });
    });

    var tgContinueBtn = document.getElementById('ordTelegramContinue');
    if (tgContinueBtn) {
      tgContinueBtn.addEventListener('click', function () {
        var name = form.querySelector('#ordName').value.trim();
        var siteInfo = form.querySelector('#ordSite').value.trim();
        var lines = [];
        if (name) lines.push(T.tgName(name));
        if (siteInfo) lines.push(T.tgSite(siteInfo));
        lines.push(T.tgIntent);
        window.open('https://t.me/Theivankoo?text=' + encodeURIComponent(lines.join(' ')), '_blank', 'noopener');
      });
    }
  })();

  /* ---------- analytics + reviews (Supabase) ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var SUPABASE_URL = 'https://ywzgrdvupvmjonbxzavq.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_98fnRyYsFRsi09tnUzqsBg__TZMTqek';
    if (!window.supabase || !window.supabase.createClient) return;
    var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    (function () {
      var sid = null;
      try {
        sid = localStorage.getItem('pf_sid');
        if (!sid) {
          sid = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
          localStorage.setItem('pf_sid', sid);
        }
      } catch (e) {
        sid = String(Date.now()) + Math.random().toString(16).slice(2);
      }

      // Goes through the track_page_view RPC. A direct .upsert() here was
      // rejected by RLS (INSERT ... ON CONFLICT DO UPDATE is also checked
      // against the UPDATE policy), which is why page_views stayed empty and
      // the stats page always reported 0 visitors.
      function ping() {
        client.rpc('track_page_view', { sid: sid }).then(function () {}, function () {});
      }
      ping();
      setInterval(ping, 30000);

      document.querySelectorAll('[data-cta]').forEach(function (el) {
        el.addEventListener('click', function () {
          client.from('cta_clicks').insert({
            session_id: sid,
            cta_name: el.getAttribute('data-cta')
          }).then(function () {}, function () {});
        });
      });
    })();

    var listEl = document.getElementById('reviewsList');
    var emptyEl = document.getElementById('reviewsEmpty');
    var form = document.getElementById('reviewForm');
    var starPicker = document.getElementById('starPicker');
    var starBtns = starPicker ? starPicker.querySelectorAll('.star-btn') : [];
    var msgEl = document.getElementById('reviewFormMsg');
    var submitBtn = document.getElementById('revSubmit');
    var currentRating = 0;

    function setStars(value) {
      currentRating = value;
      starBtns.forEach(function (btn) {
        var v = parseInt(btn.getAttribute('data-value'), 10);
        btn.classList.toggle('is-filled', v <= value);
        btn.setAttribute('aria-checked', v === value ? 'true' : 'false');
      });
    }
    starBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setStars(parseInt(btn.getAttribute('data-value'), 10));
      });
    });

    function starsMarkup(rating) {
      var wrap = document.createElement('span');
      wrap.className = 'review-stars';
      for (var i = 1; i <= 5; i++) {
        var s = document.createElement('span');
        s.textContent = '★';
        if (i > rating) s.classList.add('star-off');
        wrap.appendChild(s);
      }
      return wrap;
    }

    function safeSiteHref(raw) {
      var v = (raw || '').trim();
      if (!v) return null;
      if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
      try {
        var u = new URL(v);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        return u.href;
      } catch (e) { return null; }
    }

    function safeTelegramHandle(raw) {
      var v = (raw || '').replace(/^@/, '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 32);
      return v || null;
    }

    function formatDate(iso) {
      try {
        return new Date(iso).toLocaleDateString(T.locale, { day: 'numeric', month: 'short', year: 'numeric' });
      } catch (e) { return ''; }
    }

    function renderReview(row, prepend) {
      if (emptyEl) { emptyEl.remove(); emptyEl = null; }
      var card = document.createElement('div');
      card.className = 'review-card';

      var top = document.createElement('div');
      top.className = 'review-top';

      var who = document.createElement('div');
      who.className = 'review-who';
      var nick = document.createElement('span');
      nick.className = 'review-nick';
      nick.textContent = row.nickname;
      who.appendChild(nick);

      var links = document.createElement('div');
      links.className = 'review-links';
      var siteHref = safeSiteHref(row.site_url);
      if (siteHref) {
        var a = document.createElement('a');
        a.href = siteHref;
        a.target = '_blank';
        a.rel = 'noopener nofollow';
        a.textContent = T.siteLink;
        links.appendChild(a);
      }
      var tg = safeTelegramHandle(row.telegram);
      if (tg) {
        var t = document.createElement('a');
        t.href = 'https://t.me/' + tg;
        t.target = '_blank';
        t.rel = 'noopener nofollow';
        t.textContent = '@' + tg;
        links.appendChild(t);
      }
      if (links.childNodes.length) who.appendChild(links);
      top.appendChild(who);

      var rating = Math.max(1, Math.min(5, parseInt(row.rating, 10) || 0));
      top.appendChild(starsMarkup(rating));
      card.appendChild(top);

      var text = document.createElement('p');
      text.className = 'review-text';
      text.textContent = row.review_text;
      card.appendChild(text);

      if (row.created_at) {
        var date = document.createElement('p');
        date.className = 'review-date';
        date.textContent = formatDate(row.created_at);
        card.appendChild(date);
      }

      if (prepend && listEl.firstChild) {
        listEl.insertBefore(card, listEl.firstChild);
      } else {
        listEl.appendChild(card);
      }
      if (window.applyTilt) window.applyTilt(card, 6);
    }

    function loadReviews() {
      if (!listEl) return;
      client.from('reviews').select('*').order('created_at', { ascending: false }).limit(50)
        .then(function (res) {
          if (res.error) throw res.error;
          var rows = res.data || [];
          if (!rows.length) {
            if (emptyEl) emptyEl.textContent = T.reviewsEmpty;
            return;
          }
          if (emptyEl) { emptyEl.remove(); emptyEl = null; }
          rows.forEach(function (row) { renderReview(row, false); });
        })
        .catch(function () {
          if (emptyEl) emptyEl.textContent = T.reviewsFailed;
        });
    }
    loadReviews();

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        msgEl.textContent = '';
        msgEl.className = 'review-form-msg';

        var honeypot = form.querySelector('#revWebsite').value;
        var nickname = form.querySelector('#revNick').value.trim();
        var reviewText = form.querySelector('#revText').value.trim();
        var siteUrl = form.querySelector('#revSite').value.trim();
        var telegram = form.querySelector('#revTg').value.trim();

        if (honeypot) {
          form.reset();
          setStars(0);
          msgEl.textContent = T.reviewThanks;
          msgEl.className = 'review-form-msg is-success';
          return;
        }
        if (!nickname || !reviewText || currentRating < 1) {
          msgEl.textContent = T.reviewIncomplete;
          msgEl.className = 'review-form-msg is-error';
          return;
        }

        submitBtn.disabled = true;
        submitBtn.style.opacity = '.6';

        client.from('reviews').insert({
          nickname: nickname.slice(0, 60),
          site_url: siteUrl ? siteUrl.slice(0, 200) : null,
          telegram: telegram ? telegram.slice(0, 60) : null,
          rating: currentRating,
          review_text: reviewText.slice(0, 600)
        }).select().then(function (res) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          if (res.error) throw res.error;
          var row = (res.data && res.data[0]) || {
            nickname: nickname, site_url: siteUrl, telegram: telegram,
            rating: currentRating, review_text: reviewText, created_at: new Date().toISOString()
          };
          renderReview(row, true);
          form.reset();
          setStars(0);
          msgEl.textContent = T.reviewThanks;
          msgEl.className = 'review-form-msg is-success';
        }).catch(function () {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          msgEl.textContent = T.reviewFailed;
          msgEl.className = 'review-form-msg is-error';
        });
      });
    }
  });
})();
