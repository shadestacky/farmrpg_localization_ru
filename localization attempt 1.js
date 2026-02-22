// ==UserScript==
// @name         FarmRPG Localization
// @namespace    http://tampermonkey.net/
// @version      2026-02-06
// @description  Translating FarmRPG to other languages (client-side only)
// @author       You
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ---- Config ----
    const currentLanguage = 'ru';

    const uiMap = {
        always: {
            nav_title: '.navbar .center.sliding',

            nav_home: 'a[href="index.php"] .item-title',
            nav_profile: 'a[href="profile.php"] .item-title',
            nav_inventory: 'a[href="inventory.php"] .item-title',
            nav_workshop: 'a[href="workshop.php"] .item-title',
            nav_kitchen: 'a[href="kitchen.php"] .item-title',
            nav_mailbox: 'a[href="postoffice.php"] .item-title',
            nav_messages: 'a[href="messages.php"] .item-title',
            nav_friends: 'a[href="friends.php"] .item-title',
            nav_settings: 'a[href="settings.php"] .item-title',
            nav_town: 'a[href="town.php"] .item-title',
            nav_library: 'a[href="wiki.php"] .item-title',
            nav_about: 'a[href="about.php"] .item-title',
            nav_logout: 'a[href="logout.php"] .item-title',
        },
        // Per-page UI map. Entries can carry extra metadata about how to localize safely.
        index: {
            // Purple mailbox button at the top of the home page
            index_mailbox_prefix: {
                selector: '.view-main a.btnpurple[href="postoffice.php"]',
                type: 'mailboxButton',
            },

            // Section titles
            index_where_go: {
                selector: '.view-main .content-block-title',
                type: 'exactText',
                match: 'Where do you want to go?',
            },
            index_my_skills_title: {
                selector: '.view-main .content-block-title',
                type: 'exactText',
                match: 'My skills',
            },
            index_perks_title: {
                selector: '.view-main .content-block-title',
                type: 'exactText',
                match: 'Perks, Mastery & More',
            },
            index_recent_update_title: {
                selector: '.view-main .content-block-title',
                type: 'exactText',
                match: 'Most Recent Update',
            },
            index_other_stuff_title: {
                selector: '.view-main .content-block-title',
                type: 'exactText',
                match: 'Other Stuff',
            },

            // Main action cards
            index_my_farm: {
                selector: '.view-main a[href^="xfarm.php"] .item-title',
                type: 'cardTitleWithNamePrefix',
            },
            index_my_inventory: {
                selector: '.view-main a[href="inventory.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_my_workshop: {
                selector: '.view-main a[href="workshop.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_my_kitchen: {
                selector: '.view-main a[href="kitchen.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_town: {
                selector: '.view-main a[href="town.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_fish: {
                selector: '.view-main a[href="fish.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_explore: {
                selector: '.view-main a[href="explore.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },

            // "Go Mining" card (locked)
            index_mining_locked: {
                selector: '.view-main .list-block a[href="wiki.php?page=Beta+Testing"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_mining_locked_status: {
                selector: '.view-main .list-block a[href="wiki.php?page=Beta+Testing"] .item-after',
                type: 'statusExact',
                match: 'LOCKED',
            },

            // "Help Needed" / quests
            index_quests: {
                selector: '.view-main a[href="quests.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_quests_status: {
                selector: '.view-main a[href="quests.php"] .item-after',
                type: 'numericSuffix', // "7 Left" -> "<number> осталось"
                matchPrefix: '',
            },

            // "The Tower"
            index_tower: {
                selector: '.view-main a[href="tower.php"] .item-title',
                type: 'cardTitleOnly',
            },
            index_tower_points: {
                selector: '.view-main a[href="tower.php"] .item-title span',
                type: 'prefixOnly', // "Unused Points: 4,910"
                matchPrefix: 'Unused Points:',
                translationKey: 'index_tower_points_prefix',
            },
            index_tower_level: {
                selector: '.view-main a[href="tower.php"] .item-after',
                type: 'prefixOnly', // "Level 200"
                matchPrefix: 'Level',
                translationKey: 'index_tower_level_prefix',
            },

            // "Raptor Pen"
            index_raptor_pen: {
                selector: '.view-main a[href^="pen.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            // We intentionally leave "4,713 Soap" and "4 fighting in RFC" as-is for now.

            // "Support the Game"
            index_support: {
                selector: '.view-main a[href="gold.php"] .item-title',
                type: 'cardTitleOnly',
            },

            // Perks, mastery & more card items
            index_friendship: {
                selector: '.view-main a[href="npclevels.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_daily: {
                selector: '.view-main a[href="daily.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },
            index_daily_status: {
                selector: '.view-main a[href="daily.php"] .item-after',
                type: 'statusExact',
                match: 'Done!',
            },

            // Perks & mastery items
            index_unlock_perks: {
                selector: '.view-main a[href="perks.php"] .item-title',
                type: 'cardTitleOnly',
            },
            index_unlock_perks_points: {
                selector: '.view-main a[href="perks.php"] .item-title span',
                type: 'prefixOnly', // "Unused Points: 22"
                matchPrefix: 'Unused Points:',
                translationKey: 'index_tower_points_prefix', // reuse same prefix translation
            },
            index_unlock_perks_available: {
                selector: '.view-main a[href="perks.php"] .item-after span',
                type: 'numericSuffix', // "12 Available"
            },
            index_mastery: {
                selector: '.view-main a[href="mastery.php"] .item-title',
                type: 'cardTitleAndSubtitle',
            },

            // Other Stuff buttons
            index_btn_online: {
                selector: '.view-main a[href="online.php"].button',
                type: 'buttonNumericSuffix',
            },
            index_btn_new_today: {
                selector: '.view-main a[href="members.php?type=new"].button',
                type: 'buttonNumericSuffix',
            },
            index_btn_find_player: {
                selector: '.view-main a[href="members.php?type=search"].button',
                type: 'buttonText',
            },
            index_btn_events: {
                selector: '.view-main a[href="eventcalendar.php"].button',
                type: 'eventsWithCount',
            },
            index_btn_discord: {
                selector: '.view-main a[href^="https://discord.farmrpg.com"].button',
                type: 'buttonText',
            },
            index_btn_reddit: {
                selector: '.view-main a[href^="https://www.reddit.com/r/FarmRPG/"].button',
                type: 'buttonText',
            },
            index_btn_facebook: {
                selector: '.view-main a[href^="https://www.facebook.com/FarmRPGcom"].button',
                type: 'buttonText',
            },
            index_btn_light_mode: {
                selector: '.view-main a.golight.button',
                type: 'buttonText',
            },
            index_btn_dark_mode: {
                selector: '.view-main a.godark.button',
                type: 'buttonText',
            },
            index_btn_settings_small: {
                selector: '.view-main a[href="settings.php"].button',
                type: 'buttonText',
            },
            index_btn_coc: {
                selector: '.view-main a[href="coc.php"].button',
                type: 'buttonText',
            },
            index_btn_terms: {
                selector: '.view-main a[href="terms.php"].button',
                type: 'buttonText',
            },
            index_btn_support: {
                selector: '.view-main a[href="support.php"].button',
                type: 'buttonText',
            },
        },
        profile: {

        },
        inventory: {

        },
        workshop: {

        },
        kitchen: {

        },
        mailbox: {

        },
        messages: {

        },
        friends: {

        },
        settings: {

        },
        town: {

        },
        library: {

        },
        about: {

        },
        logout: {

        },
    };


    const translations = {
        ru: {
            nav_title: "Навигация",
            nav_home: "Главная",
            nav_profile: "Мой Профиль",
            nav_inventory: "Мой Инвентарь",
            nav_workshop: "Моя Мастерская",
            nav_kitchen: "Моя Кухня",
            nav_mailbox: "Моя Почта",
            nav_messages: "Мои Сообщения",
            nav_friends: "Мои Друзья",
            nav_settings: "Мои Настройки",
            nav_town: "Город",
            nav_library: "Библиотека",
            nav_about: "Об игре / Новости",
            nav_logout: "Выйти",

            // index.php
            index_mailbox_prefix: "В вашем почтовом ящике есть предметы!",
            index_where_go: "Куда вы хотите пойти?",

            index_my_skills_title: "Мои навыки",
            index_perks_title: "Улучшения, мастерство и другое",
            index_recent_update_title: "Последнее обновление",
            index_other_stuff_title: "Прочее",

            index_my_farm_title: "Моя ферма",
            index_my_farm_sub: "", // subtitle kept dynamic except for "Farm Name:" prefix
            index_my_farm_farm_name: "Название фермы:",

            index_my_inventory_title: "Мой инвентарь",
            index_my_inventory_sub: "Выращенные культуры, предметы, материалы и т.п.",

            index_my_workshop_title: "Моя мастерская",
            index_my_workshop_sub: "Создавайте новые предметы для коллекции или продажи",

            index_my_kitchen_title: "Моя кухня",
            index_my_kitchen_sub: "Готовьте блюда для активных эффектов",

            index_town_title: "В город",
            index_town_sub: "Покупайте и продавайте, улучшайте ферму и не только",

            index_fish_title: "Пойти на рыбалку",
            index_fish_sub: "Посмотрите, что сможете поймать",

            index_explore_title: "Исследовать местность",
            index_explore_sub: "Находите новые места для исследований",

            index_mining_locked_title: "Пойти в шахту",
            index_mining_locked_sub: "Сейчас в Бете!",
            index_mining_locked_status: "ЗАБЛОКИРОВАНО",

            index_quests_title: "Нужна помощь",
            index_quests_sub: "Доступны особые поручения!",
            // For "7 Left" we only translate the word:
            index_quests_status_suffix: "осталось",

            index_tower_title: "Башня",
            index_tower_points_prefix: "Неиспользованные очки:",
            index_tower_level_prefix: "Уровень",

            index_raptor_pen_title: "Загон с рапторами",
            index_raptor_pen_sub: "4 fighting in RFC", // left as-is for now

            index_support_title: "Поддержать игру",

            index_friendship_title: "Уровни дружбы",
            index_friendship_sub: "Заводите дружбу с горожанами",

            index_daily_title: "Ежедневные поручения",
            index_daily_sub: "Получайте древние монеты каждый день",
            index_daily_status: "Готово!",

            chat_english_note: "Обратите внимание: согласно Кодексу поведения, в чате нужно общаться на английском языке.",
            chat_view_log: "Просмотреть журнал чата",

            index_unlock_perks_title: "Открыть перки",
            index_unlock_perks_available_suffix: "доступно",
            index_mastery_title: "Прогресс мастерства",
            index_mastery_sub: "Награды за урожай/рыбу/крафт",

            index_btn_online_suffix: "в сети",
            index_btn_new_today_suffix: "новых сегодня",
            index_btn_find_player: "Найти игрока",
            index_btn_events: "События",
            index_btn_discord: "Discord",
            index_btn_reddit: "Reddit",
            index_btn_facebook: "Facebook",
            index_btn_light_mode: "Светлая тема",
            index_btn_dark_mode: "Тёмная тема",
            index_btn_settings_small: "Настройки",
            index_btn_coc: "Кодекс поведения",
            index_btn_terms: "Условия и положения",
            index_btn_support: "Поддержка игры",
        }
    };

    function isOnIndexPage() {
        const path = window.location.pathname;
        return (
            path === '/' ||
            path.endsWith('/index.php') ||
            path === '/index.php'
        );
    }

    function localizeNavbar(language = 'ru') {
        const dict = translations[language];
        if (!dict) return;
    
        for (const [key, selector] of Object.entries(uiMap.always)) {
            const el = document.querySelector(selector);
            if (!el) continue;
    
            const translated = dict[key];
            if (!translated) continue;
    
            // Special case: navbar title ("Navigation")
            if (key === 'nav_title') {
                el.textContent = translated;
                continue;
            }
    
            // For item-title entries with icons and possible spans
            // We replace only the text node after the icon
            const nodes = Array.from(el.childNodes);
    
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];

                if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
                    // short-circuit: already translated
                    if (node.nodeValue.trim() === translated) {
                        break;
                    }
                    // This is usually the " Home" part after the icon
                    node.nodeValue = " " + translated;
                    break;
                }
            }
        }
    }

    function localizeChat(language = 'ru') {
        const dict = translations[language];
        if (!dict) return;
        if (!dict.chat_english_note) return;

        // Insert the note inside the "Global Quick Links" banner area.
        // This banner can be re-rendered when changing chat channels, so we re-apply idempotently.
        const chatZones = ['#chatzoneDesktop', '#chatzoneMobile'];
        for (const zoneSelector of chatZones) {
            const zone = document.querySelector(zoneSelector);
            if (!zone) continue;

            const descriptions = Array.from(zone.querySelectorAll('.item-description'));
            const quickLinks = descriptions.find((el) =>
                el.textContent?.includes('Global Quick Links:')
            );
            if (!quickLinks) continue;

            if (quickLinks.querySelector('.frpg-loc-chat-note')) continue;

            const note = document.createElement('div');
            note.className = 'frpg-loc-chat-note';
            note.style.fontSize = '11px';
            note.style.marginBottom = '6px';
            note.style.opacity = '0.9';
            note.textContent = dict.chat_english_note;

            quickLinks.insertAdjacentElement('afterbegin', note);
        }

        // "View Chat Log" button (channel changes its href)
        const chatLogButtons = Array.from(document.querySelectorAll('a.button[href^="chatlog.php?channel="]'));
        for (const btn of chatLogButtons) {
            // Only translate the fixed label if it matches
            const t = btn.textContent.trim();
            if (t === 'View Chat Log' && dict.chat_view_log) {
                btn.textContent = dict.chat_view_log;
            }
        }
    }
    
    function localizeIndex(language = 'ru') {
        if (!isOnIndexPage()) return;
        const dict = translations[language];
        if (!dict) return;

        const map = uiMap.index;

        for (const [key, cfg] of Object.entries(map)) {
            const { selector, type } = cfg;
            if (!selector || !type) continue;

            // Many of these are single elements, but we allow multiple and localize each
            const elements = Array.from(document.querySelectorAll(selector));
            if (!elements.length) continue;

            switch (type) {
                case 'mailboxButton': {
                    const translatedPrefix = dict.index_mailbox_prefix;
                    if (!translatedPrefix) break;
                    elements.forEach((el) => {
                        const text = el.textContent.trim();
                        const match = text.match(/\(([^)]+)\)/);
                        const suffix = match ? ` (${match[1]})` : '';
                        el.textContent = `${translatedPrefix} ${suffix}`.trim();
                    });
                    break;
                }

                case 'exactText': {
                    const original = cfg.match;
                    const translated = dict[key];
                    if (!original || !translated) break;
                    elements.forEach((el) => {
                        if (el.textContent.trim() === original) {
                            el.textContent = translated;
                        }
                    });
                    break;
                }

                case 'statusExact': {
                    const original = cfg.match;
                    const translated = dict[key];
                    if (!original || !translated) break;
                    elements.forEach((el) => {
                        if (el.textContent.trim() === original) {
                            el.textContent = translated;
                        }
                    });
                    break;
                }

                case 'numericSuffix': {
                    const suffix = dict[`${key}_suffix`];
                    if (!suffix) break;
                    elements.forEach((el) => {
                        const t = el.textContent.trim(); // e.g. "7 Left"
                        const m = t.match(/^(\d+)\s+\w+$/);
                        if (!m) return;
                        const num = m[1];
                        el.textContent = `${num} ${suffix}`;
                    });
                    break;
                }

                case 'prefixOnly': {
                    const translatedPrefix = dict[cfg.translationKey];
                    if (!translatedPrefix) break;
                    elements.forEach((el) => {
                        const t = el.textContent;
                        if (!t) return;
                        const originalPrefix = cfg.matchPrefix;
                        if (!originalPrefix) return;
                        // Replace only the leading prefix, keep the rest (numbers, names) as-is.
                        el.textContent = t.replace(
                            new RegExp(`^\\s*${originalPrefix}`),
                            translatedPrefix
                        );
                    });
                    break;
                }

                case 'cardTitleWithNamePrefix': {
                    const titleKey = 'index_my_farm_title';
                    const farmNamePrefixKey = 'index_my_farm_farm_name';
                    const titleTranslated = dict[titleKey];
                    const prefixTranslated = dict[farmNamePrefixKey];
                    if (!titleTranslated) break;

                    elements.forEach((titleEl) => {
                        // First line: replace static "My Farm"
                        const firstTextNode = Array.from(titleEl.childNodes).find(
                            (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length > 0
                        );
                        if (firstTextNode) {
                            firstTextNode.nodeValue = titleTranslated;
                        }

                        // Second line: only replace the "Farm Name:" prefix, keep the actual farm name
                        if (prefixTranslated) {
                            const br = titleEl.querySelector('br');
                            if (br) {
                                const span = br.nextElementSibling;
                                if (span && span.textContent) {
                                    span.textContent = span.textContent.replace(
                                        /^Farm Name:/,
                                        prefixTranslated
                                    );
                                }
                            }
                        }
                    });
                    break;
                }

                case 'cardTitleAndSubtitle': {
                    // Derive keys from the base mapping key: index_xxx -> index_xxx_title / index_xxx_sub
                    const titleKey = `${key}_title`;
                    const subKey = `${key}_sub`;
                    const titleTranslated = dict[titleKey];
                    const subTranslated = dict[subKey];
                    if (!titleTranslated && !subTranslated) break;

                    elements.forEach((titleEl) => {
                        const br = titleEl.querySelector('br');

                        // First line: title
                        const firstTextNode = Array.from(titleEl.childNodes).find(
                            (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length > 0
                        );
                        if (firstTextNode && titleTranslated) {
                            firstTextNode.nodeValue = titleTranslated;
                        }

                        // Second line: subtitle (pure UI text, no names)
                        if (br && subTranslated) {
                            const span = br.nextElementSibling;
                            if (span) {
                                span.textContent = subTranslated;
                            }
                        }
                    });
                    break;
                }

                case 'cardTitleOnly': {
                    const titleKey = `${key}_title`;
                    const titleTranslated = dict[titleKey];
                    if (!titleTranslated) break;

                    elements.forEach((titleEl) => {
                        const firstTextNode = Array.from(titleEl.childNodes).find(
                            (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length > 0
                        );
                        if (firstTextNode) {
                            firstTextNode.nodeValue = titleTranslated;
                        }
                    });
                    break;
                }

                case 'buttonText': {
                    const translated = dict[key];
                    if (!translated) break;
                    elements.forEach((el) => {
                        const nodes = Array.from(el.childNodes);
                        for (const node of nodes) {
                            if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
                                node.nodeValue = ` ${translated}`;
                                return;
                            }
                        }
                        // Fallback: if no text node found, set textContent
                        el.textContent = translated;
                    });
                    break;
                }

                case 'buttonNumericSuffix': {
                    const suffix = dict[`${key}_suffix`];
                    if (!suffix) break;
                    elements.forEach((el) => {
                        const nodes = Array.from(el.childNodes);
                        const textNode = nodes.find((n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length);
                        if (!textNode) return;
                        const m = textNode.nodeValue.trim().match(/^([\d,]+)\s+.+$/);
                        if (!m) return;
                        const num = m[1];
                        textNode.nodeValue = ` ${num} ${suffix}`;
                    });
                    break;
                }

                case 'eventsWithCount': {
                    const translated = dict[key];
                    if (!translated) break;
                    elements.forEach((el) => {
                        const nodes = Array.from(el.childNodes);
                        const textNode = nodes.find((n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length);
                        if (!textNode) return;
                        const t = textNode.nodeValue.trim(); // "Events (1)"
                        const m = t.match(/^Events\s*\(([^)]+)\)\s*$/);
                        if (!m) return;
                        const count = m[1];
                        textNode.nodeValue = ` ${translated} (${count})`;
                    });
                    break;
                }

                default:
                    // Unknown type – ignore for now
                    break;
            }
        }
    }
    
    function localizeAll(language = 'ru') {
        localizeNavbar(language);
        localizeChat(language);
        localizeIndex(language);
    }
    

    let observerTimeout = null;

    function scheduleLocalization() {
        if (observerTimeout) return;

        observerTimeout = setTimeout(() => {
            observerTimeout = null;
            localizeAll(currentLanguage);
        }, 100); // 100ms debounce window
    }

    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    // Ignore high-frequency chat message appends
                    if (
                        node.matches?.('.chat-txt') ||
                        node.querySelector?.('.chat-txt')
                    ) {
                        continue;
                    }

                    // React if navbar, main view, or chat banners update
                    if (
                        node.matches?.('.navbar, .navbar-inner, .view-left, .view-main, #chatzoneDesktop, #chatzoneMobile, .announcement, .item-description') ||
                        node.querySelector?.('.navbar, .navbar-inner, .view-left, .view-main, #chatzoneDesktop, #chatzoneMobile, .announcement, .item-description')
                    ) {
                        scheduleLocalization();
                        return;
                    }
                }
            }

            // Fallback: attempt localization once after mutations
            scheduleLocalization();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    function main() {
        console.log('[FarmRPG Localization] Loaded');
        localizeAll(currentLanguage);
        initObserver();
    }

    // waiting for DOM ready (in case navbar is rendered after load)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
